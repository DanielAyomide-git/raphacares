from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection URI
MONGO_URL = os.getenv("MONGO_URL")

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client.get_database("your_database_name")  # Replace with your database name
collection = db.get_collection("your_collection_name")  # Replace with your collection name


class DAL:
    """Data Access Layer for MongoDB operations."""

    @staticmethod
    async def create_document(data: dict) -> str:
        """Insert a new document into the collection."""
        result = await collection.insert_one(data)
        return str(result.inserted_id)

    @staticmethod
    async def get_document(document_id: str) -> dict | None:
        """Retrieve a document by its ID."""
        document = await collection.find_one({"_id": ObjectId(document_id)})
        if document:
            document["_id"] = str(document["_id"])  # Convert ObjectId to string
        return document

    @staticmethod
    async def get_all_documents() -> list[dict]:
        """Retrieve all documents from the collection."""
        documents = []
        async for document in collection.find():
            document["_id"] = str(document["_id"])  # Convert ObjectId to string
            documents.append(document)
        return documents

    @staticmethod
    async def update_document(document_id: str, data: dict) -> bool:
        """Update a document by its ID."""
        result = await collection.update_one({"_id": ObjectId(document_id)}, {"$set": data})
        return result.modified_count > 0

    @staticmethod
    async def delete_document(document_id: str) -> bool:
        """Delete a document by its ID."""
        result = await collection.delete_one({"_id": ObjectId(document_id)})
        return result.deleted_count > 0


# Ensure the connection closes gracefully on exit
async def close_connection():
    client.close()
