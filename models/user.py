from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserResponse(BaseModel):
    email: EmailStr
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str 