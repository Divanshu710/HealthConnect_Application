from pymongo import MongoClient
from .config import settings

client = MongoClient(settings.mongodb_uri)
db = client[settings.mongodb_db_name]

doctors_collection = db["doctors"]
patients_collection = db["collection"]
appointments_collection = db["appointments"]
