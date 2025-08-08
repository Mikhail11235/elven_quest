from database import SessionLocal, engine
from models import Gift, EventInfo, Base


Base.metadata.create_all(bind=engine)
db = SessionLocal()
gifts = [
    {
        "name": 'Самоцветы',
        "details": 'из саркофага мага Радомира',
        "reserved": False,
        "grade": 'legendary',
    }
]
for g in gifts:
    db.add(Gift(**g))
event = EventInfo(
    place_info="""Информация о месте будет позже""",
    dress_code_info="""Информация о дресс-коде будет позже"""
)
db.add(event)
db.commit()
db.close()
