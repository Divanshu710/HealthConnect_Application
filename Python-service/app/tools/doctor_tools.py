from langchain.tools import tool
import json
from app.db import doctors_collection

SPECIALIZATION_KEYWORDS = [
    (["chest", "heart", "bp", "blood pressure"], "Cardiologist"),
    (["skin", "rash", "acne", "itching"], "Dermatologist"),
    (["headache", "migraine", "nerve", "seizure"], "Neurologist"),
    (["child", "baby", "kid"], "Pediatrician"),
    (["bone", "joint", "fracture", "knee", "back pain"], "Orthopedist"),
    (["anxiety", "stress", "depression", "sleep"], "Psychiatrist"),
    (["pregnancy", "period", "pcos"], "Gynecologist"),
    (["diabetes", "thyroid", "hormone"], "Endocrinologist"),
]

def infer_specialization(problem: str) -> dict:
    lower = problem.lower()
    for keywords, specialization in SPECIALIZATION_KEYWORDS:
        if any(keyword in lower for keyword in keywords):
            return specialization
    return "General"


@tool
def recommend_doctors(problem: str) -> str:
    """Recommend doctors for a patient's symptom or problem text."""
    specialization = infer_specialization(problem)
    query = {} if specialization == "General" else {
        "specialization": {"$regex": f"^{specialization}$", "$options": "i"}
    }
    doctors = list(doctors_collection.find(query, {
        "name": 1, "specialization": 1, "email": 1, "phone": 1
    }).limit(5))
    return json.dumps({
        "specialization": specialization,
        "doctors": [
            {
                "id": str(doc["_id"]),
                "name": doc.get("name", ""),
                "specialization": doc.get("specialization", "General"),
            }
            for doc in doctors
        ],
    })
