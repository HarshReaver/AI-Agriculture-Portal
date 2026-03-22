import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")

# Initialize MongoDB Client
mongo_client = MongoClient(MONGO_URL)

# Database
mongo_db = mongo_client["agri_portal"]

# Collections
crop_collection = mongo_db["crop_data"]
