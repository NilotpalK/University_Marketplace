from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from models.listing import ListingCreate, ListingResponse
from services.listing_service import ListingService
from services.user_service import UserService
from services.auth_service import get_current_user
from database.connection import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

async def get_listing_service(db: AsyncIOMotorDatabase = Depends(get_database)):
    return ListingService(db)

async def get_user_service(db: AsyncIOMotorDatabase = Depends(get_database)):
    return UserService(db)

@router.post("/create", response_model=ListingResponse)
async def create_listing(
    listing: ListingCreate,
    listing_service: ListingService = Depends(get_listing_service),
    current_user_email: str = Depends(get_current_user)
):
    listing_id = await listing_service.create_listing(listing, current_user_email)
    return {
        "id": listing_id,
        **listing.dict(),
        "seller_email": current_user_email,
        "created_at": datetime.utcnow()
    }

@router.get("/all", response_model=List[ListingResponse])
async def get_all_listings(
    skip: int = 0,
    limit: int = 10,
    listing_service: ListingService = Depends(get_listing_service)
):
    return await listing_service.get_all_listings(skip, limit)

@router.get("/my-listings", response_model=List[ListingResponse])
async def get_my_listings(
    listing_service: ListingService = Depends(get_listing_service),
    current_user_email: str = Depends(get_current_user)
):
    return await listing_service.get_user_listings(current_user_email) 