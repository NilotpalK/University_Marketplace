from passlib.context import CryptContext
from models.user import UserCreate
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, database):
        self.database = database
        self.collection = database.users

    async def create_user(self, user: UserCreate):
        # Check if user already exists
        if await self.collection.find_one({"email": user.email}):
            return None
        
        # Hash the password
        hashed_password = pwd_context.hash(user.password)
        
        # Create user document
        user_dict = user.dict()
        user_dict["password"] = hashed_password
        
        result = await self.collection.insert_one(user_dict)
        return result.inserted_id

    async def authenticate_user(self, email: str, password: str):
        user = await self.collection.find_one({"email": email})
        if not user:
            return False
        if not pwd_context.verify(password, user["password"]):
            return False
        return user 