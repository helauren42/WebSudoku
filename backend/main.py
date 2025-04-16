from fastapi import FastAPI
from fastapi import responses
import uvicorn
import random

from const import HOST, PORT, PROJECT_DIR

app = FastAPI()

@app.get("/")
async def home():
    pass

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
    path = await getPath(level)
    print(f"path: {path}")
    with open(path, "r") as file:
        lines = file.readlines()
    return responses.JSONResponse(lines, 200)

if __name__ == "__main__":
    # sudokuCache.makeSudokusConcurrently()
    uvicorn.run(app="main:app", host=HOST, port=PORT, workers=1)

