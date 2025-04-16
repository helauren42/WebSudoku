from os import stat
from sudokuGenerator.sudoku_generator import getPuzzle
from const import PROJECT_DIR
import subprocess
import threading

LEVELS = ("easy", "medium", "hard", "extreme")
BACKEND_DIR = f"{PROJECT_DIR}backend/"

class makePuzzles():
    @staticmethod
    def setupDirs():
        subprocess.run(["mkdir", "-p", "puzzles"], cwd=BACKEND_DIR)
        for level in LEVELS:
            subprocess.run(["mkdir", "-p", level], cwd=f"{BACKEND_DIR}puzzles")
    @staticmethod
    def makePuzzle(min, max):
        for num in range(min, max+1):
            file = f"{str(num)}.txt"
            print(file)
            for level in LEVELS:
                print(level)
                puzzle = getPuzzle(level, f"{BACKEND_DIR}basePuzzles/{file}")
                print("writing to: ", (f"{BACKEND_DIR}puzzles/{level}/{file}"))
                with open(f"{BACKEND_DIR}puzzles/{level}/{file}", "w") as writeFile:
                    writeFile.write(puzzle)
                print("done")
    @staticmethod
    def startThreads():
        one = threading.Thread(target=makePuzzles.makePuzzle, args=(1, 200))
        two = threading.Thread(target=makePuzzles.makePuzzle, args=(201, 400))
        three = threading.Thread(target=makePuzzles.makePuzzle, args=(401, 600))
        four = threading.Thread(target=makePuzzles.makePuzzle, args=(601, 800))
        five = threading.Thread(target=makePuzzles.makePuzzle, args=(801, 1000))
        one.start()
        two.start()
        three.start()
        four.start()
        five.start()
        one.join()
        two.join()
        three.join()
        four.join()
        five.join()

def main():
    makePuzzles.setupDirs()
    makePuzzles.startThreads()

main()
