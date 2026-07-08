from pydantic import BaseModel

class MissionSearch(BaseModel):
    mission_name : str