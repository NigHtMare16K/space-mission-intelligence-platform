from fastapi import APIRouter

from app.services.dashboard.dashboard_services import (
    overview_stats
)

router = APIRouter()

@router.get("/overview")
def get_overview():
    try:
        return overview_stats()
    except Exception as e:
        print(e)
        raise e