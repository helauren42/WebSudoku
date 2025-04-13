from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

    

@app.get("/")
async def home():
    pass

@app.get("/{level}")
async def fetchSudokuPuzzle(level: int):
    pass

if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)
