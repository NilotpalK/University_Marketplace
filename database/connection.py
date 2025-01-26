from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

async def get_database():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    return client[settings.DB_NAME] 