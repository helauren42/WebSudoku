import json
import re
from fastapi import FastAPI
from fastapi import responses
import uvicorn
import random
from pydantic import BaseModel, EmailStr, field_validator
from fastapi.middleware.cors import CORSMiddleware

from const import HOST, PORT, PROJECT_DIR
from database import Database

app = FastAPI()
db = Database()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username:str
    password:str
    @field_validator("password")
    def validPassword(cls, value:str):
        pass
    @field_validator("username")
    def validUsername(cls, value:str):
        pass

class SignupRequest(LoginRequest):
    email: EmailStr
    @field_validator("password")
    def validPassword(cls, value:str):
        pattern = r'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W])(?=.{8})'
        if re.match(pattern, value):
            print("valid password")
            return
        Exception("Invalid Password")
    @field_validator("username")
    def validUsername(cls, value:str):
        pattern = r'(?=.*\W)'
        if not re.match(pattern, value):
            Exception("Invalid Password")
        return

@app.get("/")
async def home():
    return responses.HTMLResponse('omg')

@app.post("/login")
async def login(login: LoginRequest):
    print(login)

@app.post("/signup")
async def signup(signup: SignupRequest):
    print(signup)

async def getPuzzlePath(level: int) -> str:
    difficulty = ""
    match level:
        case 0:
            difficulty = "easy/"
        case 1:
            difficulty = "medium/"
        case 2:
            difficulty = "hard/"
        case 3:
            difficulty = "extreme/"
    path = PROJECT_DIR + "backend/puzzles/" + difficulty
    num = random.randint(1, 1000)
    path += str(num) + ".txt"
    return path

@app.get("/fetchPuzzle/{level}")
async def fetchPuzzle(level: int):
    print(f"request to fetch puzzle level {level}")
    path = await getPuzzlePath(level)
    print(f"path: {path}")
    with open(path, "r") as file:
        lines = file.readlines()
    return responses.JSONResponse(json.dumps(lines), 200)

if __name__ == "__main__":
    uvicorn.run(app="main:app", host=HOST, port=PORT, reload=True)

