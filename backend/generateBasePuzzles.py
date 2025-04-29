import random
import subprocess

def generate_1000_sudoku_solutions():
    def is_valid(grid, row, col, num):
        for i in range(9):
            if grid[row][i] == num or grid[i][col] == num:
                return False
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(3):
            for j in range(3):
                if grid[box_row + i][box_col + j] == num:
                    return False
        return True

    def grid_to_tuple(grid):
        return tuple(tuple(row) for row in grid)

    def generate_one_solution():
        grid = [[0] * 9 for _ in range(9)]
        def fill_grid(row=0, col=0):
            if row == 9:
                return True
            next_row, next_col = (row, col + 1) if col < 8 else (row + 1, 0)
            numbers = list(range(1, 10))
            random.shuffle(numbers)
            for num in numbers:
                if is_valid(grid, row, col, num):
                    grid[row][col] = num
                    if fill_grid(next_row, next_col):
                        return True
                    grid[row][col] = 0
            return False
        fill_grid()
        return grid

    solutions_set = set()
    solutions = []

    while len(solutions) < 1000:
        grid = generate_one_solution()
        grid_tuple = grid_to_tuple(grid)
        if grid_tuple not in solutions_set:
            solutions_set.add(grid_tuple)
            solutions.append([row[:] for row in grid])
    return solutions

if __name__ == "__main__":
    solutions = generate_1000_sudoku_solutions()
    print(f"Generated {len(solutions)} unique Sudoku solutions")

    subprocess.run(["mkdir", "-p", "basePuzzles"])

    count = 1
    for solution in solutions:
        with open(f"basePuzzles/{count}.txt", "w") as file:
            for row in solution:
                for num in row:
                    file.write(str(num))
                file.write("\n")
        count += 1

