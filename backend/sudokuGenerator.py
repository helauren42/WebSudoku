import random
import asyncio
from enum import Enum

class GameLevel(Enum):
    EASY = 0
    MEDIUM = 1
    HARD = 2

def sudokuGenerator(level: GameLevel):
    while True:
        grid = generate_solved_grid()
        puzzle = [row[:] for row in grid]
        if level == GameLevel.EASY:
            remove_count = 37
        elif level == GameLevel.MEDIUM:
            remove_count = 44
        else:
            remove_count = 51
        remove_cells(puzzle, remove_count)
        if count_solutions(puzzle) == 1:
            return puzzle

def generate_solved_grid():
    grid = [[0 for _ in range(9)] for _ in range(9)]
    solve_sudoku(grid)
    return grid

def solve_sudoku(grid):
    empty = find_empty(grid)
    if not empty:
        return True
    row, col = empty
    numbers = list(range(1, 10))
    random.shuffle(numbers)
    for num in numbers:
        if is_valid(grid, row, col, num):
            grid[row][col] = num
            if solve_sudoku(grid):
                return True
            grid[row][col] = 0
    return False

def count_solutions(grid):
    solutions = [0]
    solve_for_count(grid, solutions)
    return solutions[0]

def solve_for_count(grid, solutions):
    empty = find_empty(grid)
    if not empty:
        solutions[0] += 1
        return solutions[0] >= 2
    row, col = empty
    for num in range(1, 10):
        if is_valid(grid, row, col, num):
            grid[row][col] = num
            if solve_for_count(grid, solutions):
                return True
            grid[row][col] = 0
    return False

def find_empty(grid):
    for i in range(9):
        for j in range(9):
            if grid[i][j] == 0:
                return (i, j)
    return None

def is_valid(grid, row, col, num):
    if num in grid[row]:
        return False
    if num in [grid[i][col] for i in range(9)]:
        return False
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3
    for i in range(start_row, start_row + 3):
        for j in range(start_col, start_col + 3):
            if grid[i][j] == num:
                return False
    return True

def remove_cells(grid, count):
    positions = [(i, j) for i in range(9) for j in range(9)]
    random.shuffle(positions)
    for i in range(count):
        row, col = positions[i]
        grid[row][col] = 0

def print_sudoku(grid):
    horizontal_separator = '-' * 28
    print(horizontal_separator)
    for row in range(9):
        row_str = '|'
        for col in range(9):
            if col % 3 == 0 and col > 0:
                row_str += ' |'
            cell = str(grid[row][col]) if grid[row][col] != 0 else '.'
            row_str += ' ' + cell
        row_str += ' |'
        print(row_str)
        if row % 3 == 2:
            print(horizontal_separator)

def test_sudoku():
    grid =sudokuGenerator(GameLevel.HARD)
    print_sudoku(grid)

if __name__ == "__main__":
    test_sudoku()

