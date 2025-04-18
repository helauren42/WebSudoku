import { Board } from './Board.js';
import { useState, useEffect } from 'react';

export const HandleBoard = ({ activeGame, currentLevel, clickedX, clickedY, BOARD }) => {
	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
	}, [clickedX, clickedY])

	useEffect(() => {
		if (!BOARD)
			BOARD = new Board()
		BOARD.display(activeGame, currentLevel)
	}, [activeGame])
	return (
		<></>
	)
}

