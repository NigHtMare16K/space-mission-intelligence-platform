from pydantic import BaseModel

class MissionRequest(BaseModel):
    mission1: str
    mission2: str