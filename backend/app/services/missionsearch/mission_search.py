import numpy as np
import pandas as pd 
import operator
from typing import List,TypedDict,Annotated,Literal,Optional

from pydantic import Field,BaseModel
from langgraph.graph import START,END,StateGraph
from langgraph.types import Send

from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage,HumanMessage
from langchain_community.tools.tavily_search import TavilySearchResults

df = pd.read_csv('D:/Data Analysis/Space Mission Analysis/Dataset/Space_Missions_Dataset.csv')
df['Launch_Year'] = df['Launch_Date'].str.split("-").str[0]

from dotenv import load_dotenv

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
)

class Plan(BaseModel):
    title: str
    summary: str
    sections: List[str]
    key_points : List[str]
    reference_urls : List[str]

class State(TypedDict):
    query: str
    mission_data : dict
    reference_urls: List[str]
    scraped_content: List[str]
    plan: Plan
    blog : str

def missionnsearch(state: State):

    m1 = state["query"]

    df2 = df[df["Mission_Name"] == m1].iloc[0]

    return {
        "mission_data": {
            "mission_name": m1,
            "Country Region": df2["Country_Region"],
            "Launch Vehicle": df2["Launch_Vehicle"],
            "Agency Type": df2["Agency_Type"],
            "Mission Category": df2["Mission_Category"],
            "Status": df2["Status"],
            "Duration": df2["Duration"],
            "Agency": df2["Agency"],
            "Launch Year": df2["Launch_Year"],
            "Destination": df2["Destination"],
            "Budget": df2["Cost_USD_Million"],
            "Achievement": df2["Key_Achievement"],
            "Objective": df2["Objective"],
        }
    }

PLANNING_SYSTEM = """
You are an expert technical blog planning agent specializing in space missions.

Your task is to analyze the provided mission information and any reference content, then create a structured plan for an educational blog.

The blog should be written for students, educators, and space enthusiasts.

Guidelines:

- Generate an engaging and descriptive blog title.
- Create a logical sequence of sections that tells the story of the mission.
- Identify the most important facts that must be covered in the blog.
- Use the provided reference URLs to support the content whenever applicable.
- Prioritize the provided mission information over external references.
- Do not invent facts or include information not supported by the provided content.
- Focus on explaining:
    • Why the mission was undertaken.
    • The mission objectives.
    • Technologies and launch vehicle.
    • Major events during the mission.
    • Key achievements.
    • Scientific and historical impact.
    • Interesting facts for readers.

Return ONLY the structured plan according to the provided schema.
Do not write the actual blog.
"""


def planner_node(state: State):

    planner = llm.with_structured_output(Plan)

    mission_data = state["mission_data"]
    reference_urls = state["reference_urls"]
    scraped_content = state["scraped_content"]

    plan = planner.invoke(
        [
            SystemMessage(content=PLANNING_SYSTEM),
            HumanMessage(
                content=f"""
                Mission Information:
                {mission_data}
                {scraped_content}

                Reference URLs:
                {reference_urls}

                Create a structured plan for writing a comprehensive educational blog about this mission.
                """
            ),
        ]
    )

    return {
        "plan": plan
    }

def web_search(state: State):

    query = state["query"]

    tool = TavilySearchResults(max_results=2)

    results = tool.invoke({"query": query})

    normalized: List[str] = []

    for r in results or []:
        url = r.get("url")

        if url and url not in normalized:
            normalized.append(url)

    return {
        "reference_urls": normalized
    }
    
from typing import List
from tavily import TavilyClient

client = TavilyClient()

def scrape_urls(state: State):

    urls = state["reference_urls"]

    result = client.extract(urls=urls)

    content: List[str] = []

    for r in result.get("results", []):
        raw_content = r.get("raw_content")

        if raw_content:
            content.append(raw_content)

    return {
        "scraped_content": content
    }

def context_compression(state: State):
    MAX_WORDS = 1200
    scraped_content = state["scraped_content"]
    compressed = []

    for doc in scraped_content:
        words = doc.split()
        compressed.append(" ".join(words[:MAX_WORDS]))

    return {
        "scraped_content": compressed
    }

WRITER_SYSTEM = """
You are an expert aerospace writer and educator.

Your task is to write a comprehensive, engaging, and factually accurate blog about the given space mission.

Instructions:

- Follow the provided blog plan exactly.
- Use the mission information as the primary source of truth.
- Use the scraped reference content only to enrich explanations and provide additional historical or scientific context.
- Never contradict the provided mission data.
- Do not invent facts. If information is missing, simply omit it.
- Write for students, educators, and space enthusiasts.
- Use clear and engaging language.
- Explain technical concepts in simple terms whenever possible.
- Include informative headings for each section.
- Maintain a logical flow from introduction to conclusion.
- Highlight:
    - Mission objectives
    - Historical background
    - Launch vehicle and technology
    - Mission timeline
    - Key achievements
    - Scientific discoveries
    - Long-term impact
    - Interesting facts
- End with a short conclusion summarizing the mission's significance.
- Finally add a "References" section listing the provided reference URLs.

Return only the completed blog in Markdown format.
"""

def blog_writer(state: State):

    topic = state["query"]
    mission_data = state["mission_data"]
    scraped_content = state["scraped_content"]
    plan = state["plan"]
    reference_urls = state["reference_urls"]

    response = llm.invoke(
        [
            SystemMessage(content=WRITER_SYSTEM),
            HumanMessage(
                content=f"""
                    Mission:
                    {topic}

                    Blog Plan:
                    {plan}

                    Mission Information:
                    {mission_data}

                    Reference Content:
                    {chr(10).join(scraped_content)}

                    Reference URLs:
                    {chr(10).join(reference_urls)}
            """
            ),
        ]
    )

    return {
        "blog": response.content
    }

g = StateGraph(State)
g.add_node("mission_search",missionnsearch)
g.add_node("web_search",web_search)
g.add_node("scrape_urls",scrape_urls)
g.add_node("plan",planner_node)
g.add_node("blog_writer",blog_writer)
g.add_node("context_compression",context_compression)

g.add_edge(START,"mission_search")
g.add_edge("mission_search","web_search")
g.add_edge("web_search","scrape_urls")
g.add_edge("scrape_urls","context_compression")
g.add_edge("context_compression","plan")
g.add_edge("plan","blog_writer")
g.add_edge("blog_writer",END)

app = g.compile()


def chat(query:str):
    result = app.invoke(
        {
            "query": query
        }
    )

    return {
        "mission_data": result["mission_data"],
        "blog": result["blog"],
        "reference_urls": result["reference_urls"]
    }