from fastapi import APIRouter

from app.services.mission_recommender.recommendation_search import recommend_missions

from app.schemas.recommendation import MissionRecommend

router = APIRouter(
    prefix = "/mission-recommend",
    tags = ['Mission Recommend']
)

@router.post('/recommend')
def recommendation(request: MissionRecommend):
    return recommend_missions(request.mission_name)