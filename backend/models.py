from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base


class Gift(Base):
    __tablename__ = "gifts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    link = Column(String(255), nullable=True)
    image = Column(String(512), nullable=True)
    reserved = Column(Boolean, default=False)
    grade = Column(String(20), default="common")  # legendary, epic, rare, common


class EventInfo(Base):
    __tablename__ = "event_info"

    id = Column(Integer, primary_key=True, index=True)
    place_info = Column(Text, nullable=False)
    dress_code_info = Column(Text, nullable=False)
