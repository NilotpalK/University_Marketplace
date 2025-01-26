from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    category: str
    condition: str  # e.g., "new", "used", "like new"
    location: str   # e.g., "Engineering Building", "Library", etc.

class ListingResponse(BaseModel):
    id: str
    title: str
    description: str
    price: float
    category: str
    condition: str
    location: str
    seller_email: str
    created_at: datetime 