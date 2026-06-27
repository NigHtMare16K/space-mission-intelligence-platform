import numpy as np
import pandas as pd
from dotenv import load_dotenv
load_dotenv()

from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI


class MissionComparison(BaseModel):
    historical_impact: str
    scientific_value: str
    technological_innovation: str
    cost_efficiency: str
    mission_success: str
    overall_winner: str
    similarities: list[str]
    differences: list[str]
    summary: str


df = pd.read_csv(
    'D:/Data Analysis/Space Mission Analysis/Dataset/Space_Missions_Dataset.csv'
)

df['Launch_Year'] = df['Launch_Date'].str.split("-").str[0]


def MissionComp(m1, m2):

    mission1 = df[df['Mission_Name'] == m1]
    mission2 = df[df['Mission_Name'] == m2]

    if mission1.empty:
        raise ValueError(f"Mission '{m1}' not found.")

    if mission2.empty:
        raise ValueError(f"Mission '{m2}' not found.")

    df2 = mission1.iloc[0]
    df3 = mission2.iloc[0]

    l1 = df2['Launch_Year']
    l2 = df3['Launch_Year']

    d1 = df2['Destination']
    d2 = df3['Destination']

    a1 = df2['Agency']
    a2 = df3['Agency']

    b1 = df2['Cost_USD_Million']
    b2 = df3['Cost_USD_Million']

    t1 = df2['Duration']
    t2 = df3['Duration']

    agency_type1 = df2['Agency_Type']
    agency_type2 = df3['Agency_Type']

    launch1 = df2['Launch_Vehicle']
    launch2 = df3['Launch_Vehicle']

    s1 = df2['Status']
    s2 = df3['Status']

    mission_cat1 = df2['Mission_Category']
    mission_cat2 = df3['Mission_Category']

    ach1 = df2['Key_Achievement']
    ach2 = df3['Key_Achievement']

    obj1 = df2['Objective']
    obj2 = df3['Objective']

    return {
        "mission_1": {
            'mission_name': m1,
            'Launch Vehicle': launch1,
            'Agency Type': agency_type1,
            'Mission Category': mission_cat1,
            'Status': s1,
            'Duration': t1,
            'Agency': a1,
            'Launch Year': l1,
            'Destination': d1,
            'Budget': b1,
            'Achievement': ach1,
            'Objective': obj1
        },
        "mission_2": {
            'mission_name': m2,
            'Launch Vehicle': launch2,
            'Agency Type': agency_type2,
            'Mission Category': mission_cat2,
            'Status': s2,
            'Duration': t2,
            'Agency': a2,
            'Launch Year': l2,
            'Destination': d2,
            'Budget': b2,
            'Achievement': ach2,
            'Objective': obj2
        }
    }


llm = ChatGoogleGenerativeAI(
    model='gemini-2.5-flash'
)

structured_llm = llm.with_structured_output(
    MissionComparison
)


def llm_comp(m1, m2):

    a = MissionComp(m1, m2)

    prompt = f"""
    You are an expert space mission analyst and educator.

    Compare the following two space missions primarily using the provided mission data.

    Mission 1:
    {a['mission_1']}

    Mission 2:
    {a['mission_2']}

    Your task:

    1. Determine which mission had greater historical impact.
    2. Determine which mission contributed more scientifically.
    3. Determine which mission demonstrated greater technological innovation.
    4. Determine which mission was more cost efficient.
    5. Determine which mission was more successful overall.

    Guidelines:
    - Prioritize the provided mission information.
    - Use general space knowledge only when absolutely necessary.
    - Never invent missing facts.
    - If a category cannot be determined fairly, return "Tie".
    - Explain decisions concisely.
    - Write for students and space enthusiasts.

    Similarities:
    - Include common objectives, destinations, technologies, or mission goals.

    Differences:
    - Include launch year, destination, agency, cost, status, duration, or achievements.

    The overall winner should consider:
    - Historical significance
    - Scientific value
    - Mission success
    - Technological contribution

    The summary should be 150–250 words explaining the comparison and final verdict.
    """

    response = structured_llm.invoke(prompt)

    return response.model_dump()