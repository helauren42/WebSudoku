import { SOCKET_ADDRESS } from './Const';

const MODE_INSERT = "insert"
const MODE_NOTE = "note"

/**
 * @typedef {Object} Cell
 * @property {number|null} value - The cell's value (e.g., 1-9 for Sudoku).
 * @property {number[]} notes - Array of possible values (notes).
 * @property {boolean|null} mod - Whether the cell is modifiable.
 */

/**
 * @class
 */
class Cell {
	constructor() {
		this.value = null
		this.notes = new Set()
		this.mod = null;
	}
	init(_value) {
		this.value = _value
		this.mod = _value != 0 ? "const" : "var"
	}
	fill(_value) {
		if (this.mod == "const") {
			throw "This cell value can not be modified"
		}
		else {
			if (this.value == _value)
				this.value = 0
			else
				this.value = _value
		}
	}
	addNotes(number) {
		this.notes.has(number) ? this.notes.delete(number) : this.notes.add(number)
	}
	rmNotes() {
		this.notes.clear()
	}
}

class Game {
	constructor(level, puzzle, solution) {
		this.level = level
		this.puzzle = puzzle
		this.solution = solution
		this.startTime = new Date()
		console.log("START TIME: ", this.startTime)
	}
}

class AbstractBoard {
	constructor() {
		this.game = null
		this.staticPuzzle = this.getStaticPuzzle()
		this.selectedRow = null
		this.selectedColumn = null
		this.oldSelectedRow = null
		this.oldSelectedColumn = null
		this.msc = 10
		this.makeCanvas()
	}
	makeCanvas() {
		console.log("make board canvas")
		let length;

		let canvas = document.getElementById('my-canvas')
		let container = document.getElementById('my-canvas-container')
		let parentHeight = container.getBoundingClientRect().height
		let parentWidth = container.getBoundingClientRect().width

		if (parentHeight >= parentWidth) {
			length = parentWidth * 0.8
		}
		else {
			length = parentHeight * 0.85
		}
		console.log(this.msc)
		canvas.width = length + this.msc * 3
		canvas.height = length + this.msc * 3

		this.length = length
		this.cellLength = length / 9
		this.noteCellLength = this.cellLength / 3
		this.cellStruct = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
		return
	}
	makePuzzleStructure() {
		let ret = []
		for (let i = 1; i <= 9; i++) {
			let row = []
			for (let j = 1; j <= 9; j++) {
				row.push(new Cell())
			}
			ret.push(row)
		}
		return ret;
	}
	initPuzzle(sudokuGrid, puzzle) {
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				puzzle[y][x].init(sudokuGrid[y][x])
			}
		}
	}
	getStaticPuzzle() {
		const sudokuGrid = [
			[5, 3, 4, 6, 7, 8, 9, 1, 2],
			[6, 7, 2, 1, 9, 5, 3, 4, 8],
			[1, 9, 8, 3, 4, 2, 5, 6, 7],
			[8, 5, 9, 7, 6, 1, 4, 2, 3],
			[4, 2, 6, 8, 5, 3, 7, 9, 1],
			[7, 1, 3, 9, 2, 4, 8, 5, 6],
			[9, 6, 1, 5, 3, 7, 2, 8, 4],
			[2, 8, 7, 4, 1, 9, 6, 3, 5],
			[3, 4, 5, 2, 8, 6, 1, 7, 9]
		];
		let puzzle = this.makePuzzleStructure()
		this.initPuzzle(sudokuGrid, puzzle)
		return puzzle
	}
	makeSudokuGrid(array) {
		let ret = []
		for (let i = 0; array[i]; i++) {
			const string = array[i]
			let row = []
			for (let j = 0; string[j]; j++) {
				row.push(parseInt(string[j]))
			}
			ret.push(row)
		}
		return ret
	}
	makeDynamicPuzzle(array) {
		let puzzle = this.makePuzzleStructure()
		const sudokuGrid = this.makeSudokuGrid(array)
		this.initPuzzle(sudokuGrid, puzzle)
		return puzzle
	}
	clearBoard() {
		this.ctx.fillStyle = '#bfd2cc'
		this.ctx.fillRect(10, 10, this.length, this.length)
	}
	drawNotes(notes, cellX, cellY) {
		this.ctx.fillStyle = "#4b6a66"
		/** @type {Set<number>} */
		for (let r = 0; r <= 2; r++) {
			for (let c = 0; c <= 2; c++) {
				const search = this.cellStruct[r][c]
				if (notes.has(search)) {
					console.log("drawing note: ", search)
					this.ctx.lineWidth = 1
					let startX = cellX + this.noteCellLength * c
					let startY = cellY + this.noteCellLength * r
					// at this point startX and startY do not include centering of the text only the starting point of a subcell for the note
					const midX = startX + this.noteCellLength / 2
					const midY = startY + this.noteCellLength / 2
					this.ctx.font = `${this.noteCellLength * 0.8}px Roboto Slab`
					const textSize = this.ctx.measureText(search)
					startX = midX - textSize.width / 2
					startY = midY + (textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) / 2
					this.ctx.fillText(search, startX, startY)
				}
			}
		}
	}
	drawSelectedCell() {
		console.log("drawing selected cell")
		const x = this.selectedColumn - 1
		const y = this.selectedRow - 1
		const cellX = this.msc + this.cellLength * x
		const cellY = this.msc + this.cellLength * y
		// make background light color
		this.ctx.fillStyle = "#bad6cf"
		this.ctx.fillRect(cellX, cellY, this.cellLength, this.cellLength)

		// make border
		this.ctx.strokeStyle = "#859c95"
		this.ctx.lineWidth = 4
		this.drawCell(cellX, cellY)

		// draw Number
		this.drawInsideCell(x, y, cellX, cellY, this.game.puzzle)
	}
	drawCell(cellX, cellY) {
		this.ctx.beginPath()
		this.ctx.rect(cellX, cellY, this.cellLength, this.cellLength)
		this.ctx.stroke()
	}
	drawInsideCell(x, y, cellX, cellY, puzzle) {
		// console.log("draw inside cell()")
		const character = puzzle[y][x].value
		if (character === 0) {
			if (puzzle[y][x].notes.size > 0) {
				console.log("draw inside cell finds notes: ", puzzle[y][x].notes)
				this.drawNotes(puzzle[y][x].notes, cellX, cellY)
			}
			return
		}
		this.ctx.fillStyle = puzzle[y][x].mod == "const" ? '#343d39' : "#4b6a66"
		const midx = cellX + (this.cellLength / 2)
		const midy = cellY + (this.cellLength / 2)
		this.ctx.font = `${this.cellLength * 0.8}px Roboto Slab`
		const textSize = this.ctx.measureText(character)
		const startX = midx - textSize.width / 2;
		const startY = midy + (textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) / 2
		this.ctx.fillText(character, startX, startY)

	}
	drawRegions() {
		this.ctx.lineWidth = 3
		this.ctx.strokeStyle = '#455c52'
		this.ctx.beginPath()
		const regionLength = this.length / 3
		for (let y = 0; y <= 3; y++) {
			this.ctx.moveTo(this.msc, this.msc + y * regionLength)
			this.ctx.lineTo(this.msc + this.length, this.msc + y * regionLength)
			this.ctx.stroke()
		}
		for (let x = 0; x <= 3; x++) {
			this.ctx.moveTo(this.msc + x * regionLength, this.msc)
			this.ctx.lineTo(this.msc + x * regionLength, this.msc + this.length)
			this.ctx.stroke()
		}
	}
	/**
	 * @param {Cell[][]} puzzle - 2D array of Cell objects
	 */
	drawPuzzle(puzzle) {
		console.log("drawPuzzle()")
		this.ctx.fillStyle = '#bfd2cc'
		this.ctx.fillRect(10, 10, this.length, this.length)

		this.drawRegions()
		this.ctx.lineWidth = 1
		// this.ctx.strokeStyle = '#343d39'

		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				const cellX = x * this.cellLength + this.msc
				const cellY = y * this.cellLength + this.msc
				this.drawCell(cellX, cellY)
				this.drawInsideCell(x, y, cellX, cellY, puzzle)
			}
		}
	}
	async fetchDynamicPuzzle(currentLevel) {
		const url = "http://" + SOCKET_ADDRESS + '/fetchPuzzle/' + currentLevel
		console.log(url)
		const data = await fetch(url).then((res) => {
			return res.json()
		}
		).then((response) => {
			return JSON.parse(response)
		})
		console.log(data)
		return [this.makeDynamicPuzzle(data["puzzle"]), data["solution"]]
	}
}

/**
 * @typedef {Object} AbstractBoard
 * @property {function(): void} makeCanvas - Creates the canvas.
 * @property {Game|null} game - The current game instance.
 * @property {Cell[][]} staticPuzzle - Static puzzle grid.
 * @property {number|null} row - Selected row index.
 * @property {number|null} column - Selected column index.
 * @property {number} msc - Some constant (e.g., 10).
 */

/**
 * @class
 */
export class Board extends AbstractBoard {
	constructor() {
		super()
		console.log("Board constructor")
	}
	drawStaticPuzzle() {
		this.drawPuzzle(this.staticPuzzle)
	}
	drawDynamicPuzzle() {
		console.log("drawDynamicPuzzle: ")
		this.drawPuzzle(this.game.puzzle)
		if (this.selectedColumn && this.selectedRow && this.selectedColumn >= 1 && this.selectedColumn <= 9 && this.selectedRow >= 1 && this.selectedRow <= 9) {
			this.drawSelectedCell()
			console.log("draw selected cell called !!!")
		}
	}
	async fetchAndDrawDynamicPuzzle(currentLevel) {
		if (!this.game) {
			console.log(`new game ${!this.game ? "no active game" : "different level"}`)
			const puzzleAndSolution = await this.fetchDynamicPuzzle(currentLevel);
			this.game = new Game(currentLevel, puzzleAndSolution[0], puzzleAndSolution[1])
		}
		this.drawDynamicPuzzle()
	}
	updateCellValue(y, x, value) {
		try {
			this.game.puzzle[x][y].fill(value);
		}
		catch (err) {
			console.log("You tried to modify a cell from the initial puzzle: ", err)
		}
		console.log("cell new value: ", this.game.puzzle[x][y].value)
		this.drawDynamicPuzzle()
	}
	updateCellNote(y, x, value) {
		this.game.puzzle[x][y].addNotes(value)
		console.log("added note at pos x: ", x, ", y: ", y)
		console.log("new notes: ", this.game.puzzle[x][y].notes)
		this.drawDynamicPuzzle()
	}
	updateSelection(canvasX, canvasY) {
		canvasX -= this.msc
		canvasY -= this.msc
		console.log("updateSelection called")
		const posX = canvasX / this.cellLength
		const posY = canvasY / this.cellLength
		console.log("posX: ", posX)
		console.log("posY: ", posY)
		const newcolumn = Math.ceil(posX)
		const newrow = Math.ceil(posY)

		if ((newcolumn < 1 || newrow < 1 || newcolumn > 9 || newrow > 9)
			|| (this.selectedColumn && this.selectedRow && this.selectedColumn == newcolumn && this.selectedRow == newrow)) {
			this.selectedColumn = null;
			this.newrow = null;
			console.log("unselected cell")
			return null
		}
		this.selectedColumn = newcolumn
		this.selectedRow = newrow
		console.log(`selected row: ${this.selectedRow}, col: ${this.selectedColumn}`)
		return { "x": this.selectedColumn - 1, "y": this.selectedRow - 1 }
	}
	draw(activeGame, currentLevel) {
		if (!activeGame) {
			console.log("drawing static puzzle")
			this.drawStaticPuzzle()
		}
		else {
			console.log("drawing dynamic puzzle level ", currentLevel)
			this.fetchAndDrawDynamicPuzzle(currentLevel)
		}
	}
	countErrors() {
		const puzzle = this.game.puzzle
		const solution = this.game.solution
		let count = 0
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				if (solution[y][x] != puzzle[y][x].value)
					count++
			}
		}
		console.log("found ", count, " amount of errors in submitted puzzle")
		return count
	}
	countConflicts() {
		const puzzle = this.game.puzzle;
		let conflictCount = 0;

		for (let y = 0; y < 9; y++) {
			const seen = new Set();
			for (let x = 0; x < 9; x++) {
				const val = puzzle[y][x].value;
				if (val) {
					if (seen.has(val))
						conflictCount++;
					else
						seen.add(val);
				}
			}
		}
		for (let x = 0; x < 9; x++) {
			const seen = new Set();
			for (let y = 0; y < 9; y++) {
				const val = puzzle[y][x].value;
				if (val) {
					if (seen.has(val))
						conflictCount++;
					else
						seen.add(val);
				}
			}
		}
		for (let by = 0; by < 3; by++) {
			for (let bx = 0; bx < 3; bx++) {
				const seen = new Set();
				for (let dy = 0; dy < 3; dy++) {
					for (let dx = 0; dx < 3; dx++) {
						const y = by * 3 + dy;
						const x = bx * 3 + dx;
						const val = puzzle[y][x].value;
						if (val) {
							if (seen.has(val))
								conflictCount++;
							else
								seen.add(val);
						}
					}
				}
			}
		}
		return conflictCount;
	}
	hasEmptyCell() {
		const puzzle = this.game.puzzle
		console.log("puzzle: ", puzzle)
		if (!puzzle)
			return false
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				console.log(puzzle[y][x])
				console.log(puzzle[y][x].value == 0)
				if (puzzle[y][x].value == 0)
					return true
			}
		}
		return false
	}
	giveUp() {
		this.game = null
	}
	// resize() {
	// 	this.makeCanvas()
	// }
	moveSelection(side) {
		if (!this.selectedRow && !this.selectedColumn && !this.oldSelectedRow && !this.oldSelectedColumn)
			return
		this.selectedRow = !this.selectedRow ? this.oldSelectedRow : this.selectedRow
		this.selectedColumn = !this.selectedColumn ? this.oldSelectedColumn : this.selectedColumn
		switch (side) {
			case "Down":
				this.selectedRow = this.selectedRow < 9 ? this.selectedRow + 1 : this.selectedRow
				break
			case "Up":
				this.selectedRow = this.selectedRow > 1 ? this.selectedRow - 1 : this.selectedRow
				break
			case "Left":
				this.selectedColumn = this.selectedColumn > 1 ? this.selectedColumn - 1 : this.selectedColumn
				break
			case "Right":
				this.selectedColumn = this.selectedColumn < 9 ? this.selectedColumn + 1 : this.selectedColumn
				break
		}
		this.oldSelectedRow = this.selectedRow
		this.oldSelectedColumn = this.selectedColumn
		return { "x": this.selectedColumn - 1, "y": this.selectedRow - 1 }
	}
	passSubmission() {
		const pointsList = [50, 90, 320, 1200]
		const difficulty = this.game.level
		this.game = null
		const attributedPoints = pointsList[difficulty]
		return attributedPoints
	}
}
