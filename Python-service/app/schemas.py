from typing import Any, Optional
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    patientUsername: str
    message : str
    threadId : Optional[str] = None

class ChatResponse(BaseModel):
    threadId: str
    reply: str
    action: str = "NONE"
    bookingDraft: Optional[dict[str,any]] = None

class BookingDraft(BaseModel):
    patientId: str
    patientUsername: str
    doctorId: str
    doctorName: str
    date: str
    timeslot: str
    reason: str = ""
    amount: int = 200