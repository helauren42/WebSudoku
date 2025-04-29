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

	const displayErrorMessage = ((conflictCount) => {
		const word = conflictCount == 1 ? "conflict" : "conflicts"
		alert(`You have ${conflictCount} ${word} in your solution`)
	})
	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		if (activeGame) {
			const res = BOARD.updateSelection(canvasClickedX, canvasClickedY)
			setSelectedCell(res)
			console.log("selected cell: ", res)
			if (BOARD.noEmptyCell()) {
				const conflictCount = BOARD.countConflicts()
				if (conflictCount > 0) {
					displayErrorMessage(conflictCount)
				}
				else {
					// handleSuccess()
				}
			}
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
	}, [activeGame, canvasClickedX, canvasClickedY, triggerClick])
	return (
		<></>
	)
}
