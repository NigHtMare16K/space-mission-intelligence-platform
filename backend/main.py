from fastapi import FastAPI
from app.routers import dashboard,prediction

app = FastAPI()

app.include_router(dashboard.router)
app.include_router(prediction.router)

@app.get('/')
def get_view():
    return "Hello"
