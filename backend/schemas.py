from typing import List, Optional
from pydantic import BaseModel, Field

class AccessTokenIn(BaseModel):
    token: str

class GiftOut(BaseModel):
    id: int
    name: str
    details: Optional[str] = None
    link: Optional[str] = None
    image: Optional[str] = None
    reserved: bool
    grade: str = Field(
        "common",
        pattern="^(common|rare|epic|legendary)$",
        description="one of: common, rare, epic, legendary"
    )

    class Config:
        orm_mode = True

class AllInfoOut(BaseModel):
    gifts: List[GiftOut]
    place_info: str
    dress_code_info: str
