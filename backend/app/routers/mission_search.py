from fastapi import APIRouter

from app.services.missionsearch.mission_search import chat

from app.schemas.mission_Search import MissionSearch

router = APIRouter(
    prefix = "/mission-search",
    tags = ['Mission Search']
)

@router.post('/search')
def mission_search(request: MissionSearch):
    return chat(request.mission_name)