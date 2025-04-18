import { Board } from './Board.js';
import { useState, useEffect } from 'react';

let BOARD = null

/**
 * @param {boolean} activeGame
 * @param {number} currentLevel
 * @param {number} clickedX
 * @param {number} clickedY
 * @param {Board|null} BOARD
*/
export const HandleBoard = ({ activeGame, currentLevel, canvasClickedX, canvasClickedY }) => {
	console.log("handleBoard called")

	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		if (activeGame)
			BOARD.updateSelection(canvasClickedX, canvasClickedY)
	}, [canvasClickedX, canvasClickedY])
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
	}, [activeGame, canvasClickedX, canvasClickedY])
	return (
		<></>
	)
}

