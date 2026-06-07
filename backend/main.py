from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def get_view():
    return "Hello"