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
export const HandleBoard = ({ activeGame, currentLevel, clickedX, clickedY }) => {
	console.log("handleBoard called")

	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		BOARD.draw(activeGame, currentLevel)
	}, [activeGame, clickedX, clickedY])
	return (
		<></>
	)
}

