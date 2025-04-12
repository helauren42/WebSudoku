import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import './App.css'

// puzzle -> blocks -> cells

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
	constructor(difficulty) {
		this.difficulty = difficulty;
	}
	updateArrayPuzzle() {

	}
}

class AbstractBoard {
	constructor() {
		this.makeCanvas()
		this.staticPuzzle = this.getStaticPuzzle();
	}
	makeCanvas() {
		let startX;
		let startY;
		let length;

		let navbar = document.getElementById('navbar')
		let navbarrects = navbar.getBoundingClientRect()
		console.log(navbarrects)
		let canvas = document.createElement('canvas')
		let body_content = document.getElementById('body-content')
		body_content.appendChild(canvas)
		let parentHeight = body_content.getBoundingClientRect().height
		let parentWidth = body_content.getBoundingClientRect().width

		if (parentHeight >= parentWidth) {
			length = parentWidth * 0.8
		}
		else {
			length = parentHeight * 0.85
		}
		// while (length % 4 != 0 && length % 9 != 0) {
		// 	length++
		// }
		startX = (parentWidth * 0.45) / 2
		startY = parentHeight * 0.1 // + (windowHeight - (navbarrects.height + length)) * 0.1
		canvas.width = length * 1.1
		canvas.height = length * 1.1
		canvas.style.position = 'relative'
		canvas.style.left = `${startX}px`
		canvas.style.top = `${startY}px`
		canvas.style.display = 'block'
		canvas.style.marginBottom = '20%'

		this.length = length
		this.cellLength = length / 9
		this.canvas = canvas
		console.log(this.canvas)
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
	/**
	 * @param {Cell[][]} puzzle - 2D array of Cell objects
	 */
	drawPuzzle(puzzle) {

		this.ctx.fillStyle = '#bfd2cc'
		this.ctx.fillRect(10, 10, this.length, this.length)

		this.ctx.lineWidth = 4
		this.ctx.strokeStyle = '#374141'
		this.ctx.stroke()

		this.ctx.fillStyle = '#374141'
		for (let y = 0; y < 9; y++) {
			console.log("y:", puzzle[y])
			for (let x = 0; x < 9; x++) {
				let cellX = x * this.cellLength + 10
				let cellY = y * this.cellLength + 10
				this.ctx.beginPath()
				this.ctx.rect(cellX, cellY, this.cellLength, this.cellLength)
				this.ctx.stroke()

				console.log(puzzle[y][x].value)
				console.log(typeof (puzzle[y][x].value))
				const character = String(puzzle[y][x].value)
				if (character == 0)
					continue
				console.log("drawing: ", character)
				let midx = cellX + (this.cellLength / 2)
				let midy = cellY + (this.cellLength / 2)
				this.ctx.font = `${this.cellLength * 0.8}px Roboto Slab`;
				const textSize = this.ctx.measureText(character)
				let startX = midx - textSize.width / 2;
				let startY = midy + (textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) / 2;
				this.ctx.fillText(character, startX, startY)
			}
		}
	}
}

class Board extends AbstractBoard {
	constructor() {
		super()
	}
	drawStaticPuzzle() {
		this.drawPuzzle(this.staticPuzzle)
	}
}

const HandleBoard = () => {
	const [active, setActive] = useState(false)

	useEffect(() => {
		let board = new Board();
		if (!active) {
			console.log("drawing static puzzle")
			board.drawStaticPuzzle()
		}
	}, [])

	return (
		<div id="board-container">
		</div>
	)
}

const App = () => {
	return (
		<>
			<Navbar />
			<div id="body-content">
				<HandleBoard />
			</div>
		</>
	)
}

export default App;

