import json
from typing import Any
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph,MessagesState, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage

from app.config import settings
from app.tools.doctor_tools import recommend_doctors
from app.tools.appointment_tools import get_free_slots, prepare_booking

tools = [recommend_doctors, get_free_slots, prepare_booking]

llm = ChatGroq(model = "llama-3.3-70b-versatile", temperature = 0.2, api_key = settings.groq_api_key)
llm_with_tools = llm.bind_tools(tools)


SYSTEM_PROMPT = SystemMessage(content="""
You are a patient appointment assistant for HealthConnect.
You can recommend doctors, check slots, and prepare booking drafts.
Rules:
- Do not diagnose diseases.
- For urgent symptoms, tell the patient to seek immediate medical care.
- Use tools for doctor, slot, and booking data.
- Never say an appointment is booked until Razorpay payment succeeds.
- Ask one clear follow-up question if details are missing.
- Bookings can only be made from today up to 3 days ahead (today + 3 days max). Do not suggest or accept dates outside this range.
- The available timeslots are: 10-11, 11-12, 12-1, 1-2, 2-3, 3-4 (all in 24h format).
""")

def assistant(state: MessagesState):
    response = llm_with_tools.invoke([SYSTEM_PROMPT] + state["messages"])
    return {"messages": [response]}

builder = StateGraph(MessagesState)

# Adding nodes
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))

# Connecting nodes with edges
builder.add_edge(START, "assistant")
builder.add_conditional_edges("assistant", tools_condition)
builder.add_edge("tools", "assistant")

graph = builder.compile(checkpointer = MemorySaver())

def _extract_payment_action(messages: list[Any]) -> tuple[str, dict | None]:
    for message in reversed(messages):
        if isinstance(message, ToolMessage):
            try:
                data = json.loads(message.content)
            except Exception:
                continue
            if data.get("action") == "PAYMENT_REQUIRED":
                return "PAYMENT_REQUIRED", data.get("bookingDraft")
    return "NONE", None


async def run_patient_assistant(patient_username: str, message: str, thread_id: str):
    user_text = f"patientUsername: {patient_username}\nmessage: {message}"
    result = await graph.ainvoke(
        {"messages": [HumanMessage(content=user_text)]},
        config={"configurable": {"thread_id": thread_id}},
    )
    last_message = result["messages"][-1]
    action, booking_draft = _extract_payment_action(result["messages"])
    return {
        "threadId": thread_id,
        "reply": last_message.content,
        "action": action,
        "bookingDraft": booking_draft,
    }


