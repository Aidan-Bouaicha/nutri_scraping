from fastapi import APIRouter
from schemas.chat import ChatRequest
from service.chat_service import run_chat

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/message")
def chat(payload: ChatRequest):
    return run_chat(payload.profile, payload.message)
