import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Board } from './Board.js';
import { HandleBoard, BOARD, setClickPos } from './HandleBoard';
import { LeftSideButtons, RightSideButtons } from './GameButtons.js'
import './App.css'

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	const [currentLevel, setCurrentLevel] = useState(0)
	const [canvasClickedX, setCanvasClickedX] = useState(0)
	const [canvasClickedY, setCanvasClickedY] = useState(0)
	const [triggerClick, setTriggerClick] = useState(0)
	const [selectedCell, setSelectedCell] = useState(null)

	return (
		<>
			<Navbar />
			<div id="body-content">
				<LeftSideButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				<div id="my-canvas-container">
					<canvas id="my-canvas" onClick={(e) => { setClickPos(e.clientX, e.clientY, activeGame, triggerClick, setCanvasClickedX, setCanvasClickedY, setTriggerClick) }} ></canvas>
				</div>
				<HandleBoard activeGame={activeGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} canvasClickedX={canvasClickedX} canvasClickedY={canvasClickedY} triggerClick={triggerClick} setCanvasClickedX={setCanvasClickedX} setCanvasClickedY={setCanvasClickedY} setSelectedCell={setSelectedCell} />
				<RightSideButtons activeGame={activeGame} selectedCell={selectedCell} BOARD={BOARD} />
			</div>
		</>
	)
}

export default App;
