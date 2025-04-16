# !/usr/bin/python
from sudokuGenerator.Sudoku.Generator import *

def getPuzzle(level, base_file) -> str:
# setting difficulties and their cutoffs for each solve method
    difficulties = {
        'easy': (35, 0),
        'medium': (81, 5),
        'hard': (81, 10),
        'extreme': (81, 15)
    }

# getting desired difficulty from command line
    difficulty = difficulties[level]

# constructing generator object from puzzle file (space delimited columns, line delimited rows)
    gen = Generator(base_file)

# applying 100 random transformations to puzzle
    gen.randomize(100)

# applying logical reduction with corresponding difficulty cutoff
    gen.reduce_via_logical(difficulty[0])

# catching zero case
    if difficulty[1] != 0:
        # applying random reduction with corresponding difficulty cutoff
        gen.reduce_via_random(difficulty[1])

# getting copy after reductions are completed
    final = gen.board.copy()

    return final.stringify()

