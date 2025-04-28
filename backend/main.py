import json
from fastapi import FastAPI, responses, Request, status
import uvicorn
import random
from fastapi.middleware.cors import CORSMiddleware

from handleRequests import LoginRequest, SignupRequest
from const import HOST, PORT, PROJECT_DIR
from database import Database, UserData

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

@app.get("/")
async def home():
    return responses.HTMLResponse('omg')

@app.post("/login")
async def login(login: LoginRequest):
    print(login)

@app.post("/signup")
async def signup(signup: SignupRequest, request: Request):
    print(signup)
    print(await request.body())
    try:
        accountProfile:dict = db.signup(signup)
        print(accountProfile)
        print(type(accountProfile))
        return responses.JSONResponse(content={ "status": "success", "message": "signup succesfull", "accountProfile": accountProfile }, status_code=200)
    except Exception as e:
        splitted = e.__str__().split('\n')
        statusCode = int(splitted[0])
        message = splitted[1]
        print("Could not signup: ", message)
        return responses.JSONResponse(content={"status": "error", "message": message }, status_code=statusCode)

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

