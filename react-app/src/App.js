import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Board } from './Board.js';
import { HandleBoard } from './HandleBoard';
import { GameButtons } from './GameButtons.js'
import './App.css'

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	const [currentLevel, setCurrentLevel] = useState(0)
	const [canvasClickedX, setCanvasClickedX] = useState(0)
	const [canvasClickedY, setCanvasClickedY] = useState(0)

	return (
		<>
			<Navbar />
			<div id="body-content">
				<GameButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				<canvas id="my-canvas" onClick={(e) => { setCanvasClickedX(e.clientX); setCanvasClickedY(canvasClickedY); }} ></canvas>
				<HandleBoard activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} canvasClickedX={canvasClickedX} canvasClickedY={canvasClickedY} />
				<canvas id="timer-canvas"></canvas>
			</div>
		</>
	)
}

export default App;
