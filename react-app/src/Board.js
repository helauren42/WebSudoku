import { useRef, useEffect } from 'react';
import { SOCKET_ADDRESS } from './Const';
// game -> puzzle -> cells
//		-> level
class Cell {
	constructor() {
		this.value = null
		this.notes = []
		this.mod = null; // false or true
	}
	fill(_value) {
		this.value = _value
	}
	addNotes(number) {
		this.notes.push(number)
	}
	rmNotes() {
		this.notes = []
	}
}

class Game {
	constructor(level, puzzle) {
		this.level = level
		this.puzzle = puzzle
	}
}

class AbstractBoard {
	constructor() {
		this.makeCanvas()
		this.game = null
		this.staticPuzzle = this.getStaticPuzzle()
		this.row = null
		this.column = null
		this.msc = 10
	}
	makeCanvas() {
		let startY;
		let length;

		let canvas = document.getElementById('my-canvas')
		let body_content = document.getElementById('body-content')
		let parentHeight = body_content.getBoundingClientRect().height
		let parentWidth = body_content.getBoundingClientRect().width

		if (parentHeight >= parentWidth) {
			length = parentWidth * 0.8
		}
		else {
			length = parentHeight * 0.85
		}
		canvas.width = length * 1.1
		canvas.height = length * 1.05
		canvas.style.position = 'relative'
		canvas.style.top = `${startY}px`

		this.length = length
		this.noteCellLength = this.cellLength / 3
		this.cellLength = length / 9
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
	fillPuzzle(sudokuGrid, puzzle) {
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				puzzle[y][x].fill(sudokuGrid[y][x])
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
		this.fillPuzzle(sudokuGrid, puzzle)
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
		this.fillPuzzle(sudokuGrid, puzzle)
		return puzzle
	}
	clearBoard() {
		this.ctx.fillStyle = '#bfd2cc'
		this.ctx.fillRect(10, 10, this.length, this.length)
	}
	drawNotes(cellX, cellY) {
		let startX = this.msc + this.cellLength * cellX
		let startY = this.msc + this.cellLength * cellY
		for (let line = 1; line <= 3; line++) {

		}
	}
	drawSelectedCell() {
		console.log("drawing selected cell")
		const x = this.column - 1
		const y = this.row - 1
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
		console.log("!!! ", this.game.puzzle)
		console.log(x)
		console.log(y)
		console.log(cellX)
		console.log(cellY)
		this.ctx.fillStyle = "#859c95";
		this.drawInsideCell(x, y, cellX, cellY, this.game.puzzle)
	}
	drawCell(cellX, cellY) {
		this.ctx.beginPath()
		this.ctx.rect(cellX, cellY, this.cellLength, this.cellLength)
		this.ctx.stroke()
	}
	drawInsideCell(x, y, cellX, cellY, puzzle) {
		const character = puzzle[y][x].value
		if (character === 0) {
			if (puzzle[y][x].notes.length > 0)
				this.drawNotes(cellX, cellY)
			return
		}
		const midx = cellX + (this.cellLength / 2)
		const midy = cellY + (this.cellLength / 2)
		this.ctx.font = `${this.cellLength * 0.8}px Roboto Slab`;
		const textSize = this.ctx.measureText(character)
		const startX = midx - textSize.width / 2;
		const startY = midy + (textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) / 2;
		this.ctx.fillText(character, startX, startY)

	}
	/**
	 * @param {Cell[][]} puzzle - 2D array of Cell objects
	 */
	drawPuzzle(puzzle) {
		this.ctx.fillStyle = '#bfd2cc'
		this.ctx.fillRect(10, 10, this.length, this.length)

		this.ctx.lineWidth = 3
		this.ctx.strokeStyle = '#343d39'
		this.ctx.stroke()

		this.ctx.fillStyle = '#455c52'
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
		const arrayPuzzle = await fetch(url).then((res) => {
			return res.json()
		}
		).then((data) => {
			return JSON.parse(data)
		})
		return this.makeDynamicPuzzle(arrayPuzzle)
	}
}

export class Board extends AbstractBoard {
	drawStaticPuzzle() {
		this.drawPuzzle(this.staticPuzzle)
	}
	async drawDynamicPuzzle(currentLevel) {
		console.log("drawDynamicPuzzle: ", currentLevel)
		if (!this.game || this.game.level != currentLevel) {
			console.log(`new game ${!this.game ? "no active game" : "different level"}`)
			const puzzle = await this.fetchDynamicPuzzle(currentLevel);
			this.game = new Game(currentLevel, puzzle)
		}
		this.drawPuzzle(this.game.puzzle)
	}
	updateSelection(canvasX, canvasY) {
		canvasX -= this.msc
		canvasY -= this.msc
		console.log("updateSelection called")
		console.log("canvasX: ", canvasX)
		console.log("canvasY: ", canvasY)
		const posX = canvasX / this.cellLength
		const posY = canvasY / this.cellLength
		console.log("posX: ", posX)
		console.log("posY: ", posY)
		const newcolumn = Math.ceil(posX)
		const newrow = Math.ceil(posY)
		if (this.column && this.row &&
			(this.column < 1 || this.row < 1 || this.column > 9 || this.row > 9)
			|| (this.column == newcolumn && this.row == newrow)) {
			this.column = null;
			this.newrow = null;
			console.log("unselected cell")
			return
		}
		this.column = newcolumn
		this.row = newrow
		console.log(`selected cell(col: ${this.column}, row: ${this.row})`)
	}
	draw(activeGame, currentLevel) {
		if (!activeGame) {
			console.log("drawing static puzzle")
			this.drawStaticPuzzle()
		}
		else {
			console.log("drawing dynamic puzzle level ", currentLevel)
			this.drawDynamicPuzzle(currentLevel)
			if (this.column && this.row)
				this.drawSelectedCell()
		}
	}
	giveUp() {
		this.game = null
	}
	resize() {
		this.makeCanvas()
	}
}


