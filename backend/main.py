from fastapi import FastAPI
import uvicorn
from threading import Thread
from const import HOST, PORT
from sudokuGenerator import GameLevel, sudokuGenerator

app = FastAPI()

@app.get("/")
async def home():
    pass

@app.get("/fetchPuzzle/{level}")
def fetchPuzzle(level: int):
    ret = []
    print("fetched: ", ret)
    return ret

if __name__ == "__main__":
    # sudokuCache.makeSudokusConcurrently()
    uvicorn.run(app="main:app", host=HOST, port=PORT, workers=1)

