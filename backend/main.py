from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext  # For password hashing and verification
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (you can restrict it to specific origins if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# MongoDB connection
MONGO_URL = os.getenv("MONGODB_URI")
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.getenv("DATABASE_NAME")]
collection = db["users"]

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User schema
class User(BaseModel):
    username: str
    email: str
    password: str
    category: str  # Added category field

class LoginUser(BaseModel):
    email: str
    password: str

# Password hashing function
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@app.post("/register")
async def register_user(user: User):
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user.password = hashed_password
    result = await collection.insert_one(user.dict())
    return {"id": str(result.inserted_id), "message": "User registered successfully"}

@app.post("/login")
async def login_user(user: LoginUser):
    existing_user = await collection.find_one({"email": user.email})
    if existing_user and verify_password(user.password, existing_user["password"]):
        return {"message": "Login successful", "user": user.email}
    else:
        raise HTTPException(status_code=400, detail="Invalid email or password")

@app.get("/users")
async def get_users():
    users = await collection.find().to_list(100)
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return users
