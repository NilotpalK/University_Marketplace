from datetime import datetime
from models.listing import ListingCreate
from bson import ObjectId

class ListingService:
    def __init__(self, database):
        self.database = database
        self.collection = database.listings

    async def create_listing(self, listing: ListingCreate, user_email: str):
        listing_dict = listing.dict()
        listing_dict["seller_email"] = user_email
        listing_dict["created_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(listing_dict)
        return str(result.inserted_id)

    async def get_all_listings(self, skip: int = 0, limit: int = 10):
        cursor = self.collection.find().skip(skip).limit(limit).sort("created_at", -1)
        listings = await cursor.to_list(length=limit)
        for listing in listings:
            listing["id"] = str(listing.pop("_id"))
        return listings

    async def get_user_listings(self, user_email: str):
        cursor = self.collection.find({"seller_email": user_email}).sort("created_at", -1)
        listings = await cursor.to_list(length=None)
        for listing in listings:
            listing["id"] = str(listing.pop("_id"))
        return listings 