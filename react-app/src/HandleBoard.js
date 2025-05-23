import { Board } from './Board.js';
import { useEffect } from 'react';

export let BOARD = null


export const setClickPos = (clientX, clientY, activeGame, triggerClick, setCanvasClickedX, setCanvasClickedY, setTriggerClick) => {
	if (!activeGame)
		return
	if (triggerClick == 0)
		setTriggerClick(1)
	else
		setTriggerClick(0)
	const canvas = document.getElementById("my-canvas")
	const rect = canvas.getBoundingClientRect()
	const x = ((clientX - rect.left) / (rect.right - rect.left)) * canvas.width
	const y = ((clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
	setCanvasClickedX(x);
	setCanvasClickedY(y);
}

/**
 * @param {boolean} activeGame
 * @param {number} currentLevel
 * @param {number} clickedX
 * @param {number} clickedY
 * @param {Board|null} BOARD
*/
export const HandleBoard = ({ activeGame, currentLevel, triggerClick, canvasClickedX, canvasClickedY, selectedCell, setSelectedCell }) => {
	console.log("handleBoard called")

	/**
	 * @param {string} key
	*/
	const handleKeyEvents = (key) => {
		console.log("registered key down: ", key)
		if (key.startsWith("Arrow")) {
			const cell = BOARD.moveSelection(key.substring(5))
			console.log("new cell: ", cell)
			setSelectedCell(cell)
		}
		if (key == "i") {
			const insertModeBtn = document.getElementById("insert-mode")
			insertModeBtn.click()
		}
		if (key >= "1" && key <= "9") {
			const button = document.getElementById(`button-number-${key}`)
			button.click()
		}
	}

	useEffect(() => {
		const listener = (ev) => handleKeyEvents(ev.key)
		document.addEventListener('keydown', listener)
		return () => {
			console.log("destroying keydown ev listener");
			document.removeEventListener('keydown', listener);
		}
	}, [])
	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		if (activeGame) {
			const cell = BOARD.updateSelection(canvasClickedX, canvasClickedY)
			setSelectedCell(cell)
		}
	}, [canvasClickedX, canvasClickedY, triggerClick])
	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		if (!activeGame)
			BOARD.giveUp();
		BOARD.makeCanvas()
	}, [activeGame])
	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		BOARD.draw(activeGame, currentLevel)
	}, [activeGame, selectedCell])
	return (
		<></>
	)
}
