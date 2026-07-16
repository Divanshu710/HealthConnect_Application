from uuid import uuid4
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest, ChatResponse
from app.graph import run_patient_assistant

app = FastAPI(title = "HealthConnect AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5000", "https://codes-k5ka.onrender.com"],
    allow_credentials = True,
    allow_methods = ["POST", "GET"],
    allow_headers = ["*"],
)

@app.get("/health")
def health_check():
    return {"ok": True, "service": "ai-service"}

@app.post("/patient-assistant", response_model = ChatResponse)
async def patient_assistant(req: ChatRequest):
    thread_id = req.threadId or str(uuid4())
    return await run_patient_assistant(
        patient_username = req.patientUsername,
        message = req.message,
        thread_id = thread_id
    )


