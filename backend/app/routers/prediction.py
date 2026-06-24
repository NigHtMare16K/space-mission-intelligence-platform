from fastapi import APIRouter

from app.schemas.prediction import (
    MissionSuccessRequest
)

from app.services.prediction.success_servive import(
    predict_success
)

router = APIRouter(
    prefix="/Mission Success Prediction",
    tags=['Prediction Model']
)

@router.post("/success")
def predict(payload: MissionSuccessRequest):
    return predict_success(payload)