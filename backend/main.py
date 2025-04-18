import json
from fastapi import FastAPI
from fastapi import responses
import uvicorn
import random
from fastapi.middleware.cors import CORSMiddleware

from const import HOST, PORT, PROJECT_DIR

app = FastAPI()

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

async def getPath(level: int) -> str:
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
    path = await getPath(level)
    print(f"path: {path}")
    with open(path, "r") as file:
        lines = file.readlines()
    return responses.JSONResponse(json.dumps(lines), 200)

if __name__ == "__main__":
    # sudokuCache.makeSudokusConcurrently()
    uvicorn.run(app="main:app", host=HOST, port=PORT, reload=True)

