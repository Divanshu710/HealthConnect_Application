from langchain.tools import tool
import json
from bson import ObjectId
from app.db import doctors_collection, appointments_collection, patients_collection
from datetime import datetime, time, timezone, timedelta

all_slots = ["10-11", "11-12", "12-1", "1-2", "2-3", "3-4"]


def day_range(date_text: str):
    selected = datetime.strptime(date_text, "%Y-%m-%d").date()
    start = datetime.combine(selected, time.min, tzinfo=timezone.utc)
    end = datetime.combine(selected, time.max, tzinfo=timezone.utc)
    return start, end


def validate_date_range(date_text: str) -> str | None:
    """Returns error message if date is out of range, None if valid.
    Only allows booking from today up to 3 days ahead (today + 3)."""
    try:
        selected = datetime.strptime(date_text, "%Y-%m-%d").date()
    except ValueError:
        return "Invalid date format. Please use YYYY-MM-DD."
    
    today = datetime.now(timezone.utc).date()
    max_date = today + timedelta(days=3)
    
    if selected < today:
        return "Date cannot be in the past."
    if selected > max_date:
        return f"Bookings can only be made up to {max_date.isoformat()} (3 days from today)."
    return None


@tool
def get_free_slots(doctor_id: str, date: str)->str:
    """Return free slots for one doctor on a given date YYYY-MM-DD."""
    # Validate date range
    error = validate_date_range(date)
    if error:
        return json.dumps({"ok": False, "message": error, "freeSlots": [], "bookedSlots": []})

    start, end = day_range(date)

    query = {
        "doctorId": ObjectId(doctor_id),
        "date": {"$gte": start, "$lte":end}
    }
    projection = {
        "_id":0,
        "timeslot": 1
    }

    booked= list(appointments_collection.find(query, projection))\
    
    booked_slots = [appointment.get('timeslot') for appointment in booked]
    free_slots = [slot for slot in all_slots if slot not in booked_slots]

    return json.dumps({
        "ok": True,
        "doctorId": doctor_id,
        "date": date,
        "freeSlots": free_slots,
        "bookedSlots": booked_slots,
    })

@tool
def prepare_booking(patient_username: str, doctor_id: str, date: str, timeslot:str, reason : str = "")->str:
    """Validate details and return bookingDraft for Razorpay payment."""

    # Validate date range
    error = validate_date_range(date)
    if error:
        return json.dumps({"ok": False, "message": error})

    patient = patients_collection.find_one({"username": patient_username}, {"username": 1})
    doctor = doctors_collection.find_one({"_id": ObjectId(doctor_id)},{
        "name": 1, "specialization": 1
    })

    if not patient:
        return json.dumps({
            "ok": False,
            "message": "Patient Not Found."
        })
    
    if not doctor:
        return json.dumps({
            "ok": False,
            "message": "Doctor Not Found. "
        })
    
    start, end = day_range(date)

    existing = appointments_collection.find_one({
        "doctorId": ObjectId(doctor_id),
        "date": {"$gte": start, "$lte":end},
        "timeslot": timeslot
    })

    if existing:
        return json.dumps({
            "ok": False,
            "message": "Selected slot is already booked. Please choose another slot."
        })
    
    return json.dumps({
        "ok": True,
        "action": "PAYMENT_REQUIRED",
        "bookingDraft": {
            "patientId": str(patient["_id"]),
            "patientUsername": patient_username,
            "doctorId": str(doctor["_id"]),
            "doctorName": doctor.get("name", ""),
            "date": date,
            "timeslot": timeslot,
            "reason": reason,
            "amount": 200,
        },
    })
