from fastapi import FastAPI
import uvicorn
import threading
from sudokuGenerator import sudokuGenerator
import asyncio

app = FastAPI()

class sudokuCache:
    easyPuzzles = []
    mediumPuzzles = []
    hardPuzzles = []

    @staticmethod
    async def makePuzzle(puzzles, level):
        while True:
            await asyncio.sleep(1)
            if len(puzzles) < 10:
                puzzles.append(sudokuGenerator(level))
                print(f"added {level}: ", len(sudokuCache.easyPuzzles))

@app.get("/{level}")
async def getPuzzle(level: int):
    print("requested level: ", level)
    ret = []
    match level:
        case 0:
            print(len(sudokuCache.easyPuzzles))
            while not sudokuCache.easyPuzzles:
                continue
            ret = sudokuCache.easyPuzzles.pop(0)
        case 1:
            while not sudokuCache.mediumPuzzles:
                continue
            ret = sudokuCache.mediumPuzzles.pop(0)
        case 2:
            while not sudokuCache.hardPuzzles:
                continue
            ret = sudokuCache.hardPuzzles.pop(0)

def run_uvicorn():
    uvicorn.run(app="puzzleData:app", host="127.0.0.1", port=6872, reload=True)

async def runConcurrently():
    uvicorn_thread = threading.Thread(target=run_uvicorn)
    uvicorn_thread.start()

    await asyncio.gather(
        sudokuCache.makePuzzle(sudokuCache.easyPuzzles, 0),
        sudokuCache.makePuzzle(sudokuCache.mediumPuzzles, 1),
        sudokuCache.makePuzzle(sudokuCache.hardPuzzles, 2)
    )

if __name__ == "__main__":
    asyncio.run(runConcurrently())
