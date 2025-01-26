from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from models.user import UserCreate, UserResponse, UserLogin
from database.connection import get_database
from services.user_service import UserService
from services.auth_service import create_access_token
from motor.motor_asyncio import AsyncIOMotorDatabase
from config import settings

router = APIRouter()

async def get_user_service(db: AsyncIOMotorDatabase = Depends(get_database)):
    return UserService(db)

@router.post("/signup", response_model=UserResponse)
async def signup(
    user: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    result = await user_service.create_user(user)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return {"email": user.email, "full_name": user.full_name}

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_service: UserService = Depends(get_user_service)
):
    user = await user_service.authenticate_user(
        form_data.username,  # OAuth2 form uses username field for email
        form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"} 