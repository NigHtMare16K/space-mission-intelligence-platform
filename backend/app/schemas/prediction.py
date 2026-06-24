from pydantic import BaseModel

class MissionSuccessRequest(BaseModel):
    Agency: str
    Agency_Type: int
    Program_Type: str
    Mission_Category: str
    Sub_Category: str
    Launch_Vehicle: str
    Launch_Site: str
    Crew_Type: str
    Destination: str
    Cost_USD_Million: float
    Launch_Year: int
    Country_Region: str