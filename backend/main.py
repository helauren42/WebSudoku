import json
from fastapi import FastAPI, responses, Request
import uvicorn
import random
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

from handleRequests import LoginRequest, SignupRequest, PointsRequestData
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

@app.get("/")
async def home():
    return responses.HTMLResponse('omg')

@app.post("/login")
async def login(login: LoginRequest):
    try:
        accountProfile = db.login(login)
        userSessionToken = str(uuid4())
        db.storeSessionId(userSessionToken, accountProfile["username"])
    except Exception as e:
        print("error message: ", e.__str__())
        return responses.JSONResponse(content={"status": "error", "message": e.__str__() }, status_code=401)
    print("sending token: ", userSessionToken)
    response = responses.JSONResponse(content={ "status": "success", "accountProfile": accountProfile }, status_code=200)
    response.set_cookie(key="userSessionToken", value=userSessionToken, httponly=True, secure=False, samesite='lax')
    return response
@app.post("/signup")
async def signup(signup: SignupRequest):
    print(signup)
    try:
        accountProfile:dict = db.signup(signup)
        userSessionToken = str(uuid4())
        db.storeSessionId(userSessionToken, accountProfile["username"])
        response = responses.JSONResponse(content={ "status": "success", "accountProfile": accountProfile }, status_code=200)
        response.set_cookie(key="userSessionToken", value=userSessionToken, httponly=True, secure=False, samesite='lax')
        return response
    except Exception as e:
        if e.__str__().find("\n"):
            splitted = e.__str__().split('\n')
            statusCode = int(splitted[0])
            message = splitted[1]
            print("Could not signup: ", message)
            return responses.JSONResponse(content={"status": "error", "message": message }, status_code=statusCode)
        else:
            return responses.JSONResponse(content={"status": "error", "message": e.__str__() }, status_code=400)

async def getPuzzlePath(level: int, num: int) -> str:
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
    path += str(num) + ".txt"
    return path

@app.get("/fetchPuzzle/{level}")
async def fetchPuzzle(level: int):
    print(f"request to fetch puzzle level {level}")
    num = random.randint(1, 1000)
    path = await getPuzzlePath(level, num)
    print(f"path: {path}")
    with open(path, "r") as file:
        puzzleLines = file.readlines()
    with open(f"{PROJECT_DIR}backend/basePuzzles/{num}.txt") as file:
        solutionLines = file.readlines()
    return responses.JSONResponse(json.dumps({
        "puzzle":puzzleLines,
        "solution":solutionLines
    }), 200)

# 0-daily 1-weekly 2-alltime

@app.get("/getRankings/{period}")
async def getRankings(period: int):
    rankings = db.getRankings(period)
    return responses.JSONResponse(rankings)

@app.post("/addPoints")
async def addPoints(data: PointsRequestData):
    print("addPoints request")
    print("addPoints: ", data.username, " ", data.points)
    db.addPointsToUser(data.username, data.points)

if __name__ == "__main__":
    uvicorn.run(app="main:app", host=HOST, port=PORT, reload=True)

