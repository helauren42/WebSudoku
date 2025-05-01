from sudokuGenerator.sudoku_generator import getPuzzle
from const import PROJECT_DIR
import subprocess
import sys

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
    def findMin(start, end):
        output = subprocess.run(["ls"], capture_output=True, cwd=(f"{BACKEND_DIR}puzzles/extreme")).stdout.decode()
        filenames = output.split("\n")
        num = start
        while(num >= start and num <= end):
            searchName = f"{num}.txt"
            if searchName not in filenames:
                break;
            num+=1
        return num
    @staticmethod
    def allEasyPuzzles():
        for num in range(1, 1001):
            print(num)
            puzzle = getPuzzle("easy", f"{BACKEND_DIR}basePuzzles/{num}.txt")
            with open(f"{BACKEND_DIR}puzzles/easy/{num}.txt", "w") as writeFile:
                writeFile.write(puzzle)
            print(f"{num} done")

def main():
    makePuzzles.setupDirs()
    if sys.argv[1] == "easy":
        makePuzzles.allEasyPuzzles()
        sys.exit(0)
    min = int(sys.argv[1])
    max = int(sys.argv[2])
    min = makePuzzles.findMin(min, max)
    if min == max+1:
        print('already done')
    print("min: ", min)
    makePuzzles.makePuzzle(min, max)
    print('finished')

main()

# execute the script in parallel like this:
# python3 makePuzzles.py 1 100
# python3 makePuzzles.py 101 200
# python3 makePuzzles.py 201 300
# python3 makePuzzles.py 301 400
# python3 makePuzzles.py 401 500
# etc..
