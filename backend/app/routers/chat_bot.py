from fastapi import APIRouter

from app.services.chatbot.chatbot import chat
from app.schemas.chatbot import ChatRequest

router = APIRouter(
    prefix = "/chatbot",
    tags = ['chatbot']
)

@router.post('/chat')
def missionchatbot(request: ChatRequest):
    return chat(request.question)