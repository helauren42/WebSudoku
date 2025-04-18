import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Board } from './Board';
import { HandleBoard } from './HandleBoard';
import { GameButtons } from './GameButtons.js'
import './App.css'

const BOARD = null

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	const [clickedX, setClickedX] = useState(0)
	const [clickedY, setClickedY] = useState(0)
	const [currentLevel, setCurrentLevel] = useState(0)

	/**
	 * @param {number} posX
	 * @param {number} posY
	 * @param {Board|null} BOARD
	 */
	const boardClick = ((posX, posY, BOARD) => {
		setClickedX(posX)
		setClickedY(posY)
	})

	return (
		<>
			<Navbar />
			<div id="body-content">
				<GameButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				{/* <canvas id="my-canvas" onClick={(e) => boardClick(e.clientX, e.clientY)}></canvas> */}
				<canvas id="my-canvas" ></canvas>
				<HandleBoard activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} clickedX={clickedX} clickedY={clickedY} />
				<canvas id="timer-canvas"></canvas>
			</div>
		</>
	)
}

export default App;
