from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn
from src.dal import DAL, close_connection
from bson import ObjectId
from passlib.context import CryptContext
from typing import List

from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Example usage
mongodb_uri = os.getenv("MONGODB_URI")
secret_key = os.getenv("SECRET_KEY")




# Initialize FastAPI app
app = FastAPI()

# Allow all origins or restrict as per your requirement
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "*",  # Allow all for now, but you can specify a list of allowed origins
]

# Setup CORS middleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB Data Access Layer (DAL)
dal = DAL()

# User model for validation
class User(BaseModel):
    username: str
    password: str

class UserInDB(User):
    hashed_password: str

# Helper function to hash passwords
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Helper function to verify passwords
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Routes

# Register a new user
@app.post("/register", response_model=UserInDB)
async def register_user(user: User):
    existing_user = await dal.find_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = hash_password(user.password)
    user_in_db = UserInDB(username=user.username, hashed_password=hashed_password)
    
    # Insert user into the database
    await dal.insert_user(user_in_db)
    
    return user_in_db

# Login a user
@app.post("/login")
async def login_user(user: User):
    existing_user = await dal.find_user_by_username(user.username)
    if not existing_user or not verify_password(user.password, existing_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"message": "Login successful"}

# Get all users (for testing)
@app.get("/users", response_model=List[UserInDB])
async def get_users():
    users = await dal.get_all_users()
    return users

# Shutdown event to close MongoDB connection
@app.on_event("shutdown")
async def shutdown():
    await close_connection()

# Running the app with Uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
