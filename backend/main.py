from fastapi import FastAPI
from app.routers import dashboard

app = FastAPI()

app.include_router(dashboard.router)

@app.get('/')
def get_view():
    return "Hello"