import { Board } from './Board.js';
import { useState, useEffect } from 'react';

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
export const HandleBoard = ({ activeGame, currentLevel, canvasClickedX, canvasClickedY, triggerClick }) => {
	console.log("handleBoard called")



	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		if (activeGame)
			BOARD.updateSelection(canvasClickedX, canvasClickedY)
	}, [canvasClickedX, canvasClickedY, triggerClick])
	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		if (!activeGame)
			BOARD.giveUp();
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

