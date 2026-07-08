from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import dashboard,prediction,mission_comparison,mission_search,mission_recommend,chat_bot

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(prediction.router)
app.include_router(mission_comparison.router)
app.include_router(mission_search.router)
app.include_router(mission_recommend.router)
app.include_router(chat_bot.router)

@app.get('/')
def get_view():
    return "Space Mission Exploration"
