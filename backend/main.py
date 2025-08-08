import os
import shutil
import uuid
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Header, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from database import SessionLocal
from models import Gift, EventInfo
from schemas import AllInfoOut, GiftOut


USER_TYPE = 1
ADMIN_TYPE = 2


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://0.0.0.0",
        "http://localhost"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.mount("/static", StaticFiles(directory="static"), name="static")

load_dotenv()
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
if not ACCESS_TOKEN:
    raise ValueError("ACCESS_TOKEN не установлен")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_token(x_token: str = Header(..., alias="X-ACCESS-TOKEN")):
    """Check token from X-ACCESS-TOKEN header."""
    if x_token not in (ACCESS_TOKEN, ADMIN_TOKEN):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")
    if x_token == ACCESS_TOKEN:
        return USER_TYPE
    elif x_token == ADMIN_TOKEN:
        return ADMIN_TYPE
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")


UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/api/auth")
def authenticate(user_type: int = Depends(verify_token)):
    if user_type == ADMIN_TYPE:
        return {"status": "authenticated", "isAdmin": True}
    return {"status": "authenticated"}


@app.post("/api/get_info", response_model=AllInfoOut)
def get_info(db: Session = Depends(get_db), _: bool = Depends(verify_token)):
    event_info = db.query(EventInfo).first()
    if not event_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event info not found")
    return {
        "gifts": db.query(Gift).all(),
        "place_info": event_info.place_info,
        "dress_code_info": event_info.dress_code_info
    }

@app.post("/api/gifts/{gift_id}/reserve")
def reserve_gift(gift_id: int, db: Session = Depends(get_db), _: bool = Depends(verify_token)):
    gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if not gift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gift not found")
    if gift.reserved:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Gift already reserved")
    gift.reserved = True
    db.commit()
    return {"status": "reserved"}


@app.post("/api/gifts/{gift_id}/unreserve")
def unreserve_gift(gift_id: int, db: Session = Depends(get_db), _: bool = Depends(verify_token)):
    gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if not gift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gift not found")
    if not gift.reserved:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Gift not reserved")
    gift.reserved = False
    db.commit()
    return {"status": "unreserved"}


@app.post("/api/gifts/", response_model=GiftOut, status_code=status.HTTP_201_CREATED)
def create_gift(
    name: str = Form(...),
    details: str = Form(None),
    link: str = Form(None),
    grade: str = Form("common"),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_type: int = Depends(verify_token)
):
    if user_type != ADMIN_TYPE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access Denied")
    image_path = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = file_path
    gift = Gift(
        name=name,
        details=details,
        link=link,
        grade=grade,
        image=image_path
    )
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return gift


@app.put("/api/gifts/{gift_id}", response_model=GiftOut)
def update_gift(
    gift_id: int,
    name: str = Form(None),
    details: str = Form(None),
    link: str = Form(None),
    grade: str = Form(None),
    reserved: bool = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_type: int = Depends(verify_token)
):
    if user_type != ADMIN_TYPE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access Denied")
    gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if not gift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gift not found")
    if name is not None:
        gift.name = name
    if details is not None:
        gift.details = details
    if link is not None:
        gift.link = link
    if grade is not None:
        gift.grade = grade
    if reserved is not None:
        gift.reserved = reserved
    if image:
        if gift.image and os.path.exists(gift.image):
            os.remove(gift.image)
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        gift.image = file_path
    db.commit()
    db.refresh(gift)
    return gift


@app.delete("/api/gifts/{gift_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gift(
    gift_id: int,
    db: Session = Depends(get_db),
    user_type: int = Depends(verify_token)
):
    if user_type != ADMIN_TYPE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access Denied")
    gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if not gift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gift not found")

    if gift.image and os.path.exists(gift.image):
        os.remove(gift.image)

    db.delete(gift)
    db.commit()
    return
