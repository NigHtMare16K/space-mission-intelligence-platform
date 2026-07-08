from fastapi import APIRouter

from app.services.comparison.mission_comp import (
    MissionComp,
    llm_comp
)

from app.schemas.comparison import MissionRequest

router = APIRouter(
    prefix = "/mission-comparison",
    tags = ['Mission Comaprison']
)

@router.post('/compare')
def mission_compare(request: MissionRequest):
    return {
        "mission_data": MissionComp(
            request.mission1,
            request.mission2
        ),
        "ai_comparison": llm_comp(
            request.mission1,
            request.mission2
        )
    }
