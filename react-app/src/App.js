import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Board } from './Board.js';
import { HandleBoard, setClickPos } from './HandleBoard';
import { GameButtons } from './GameButtons.js'
import './App.css'

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	const [currentLevel, setCurrentLevel] = useState(0)
	const [canvasClickedX, setCanvasClickedX] = useState(0)
	const [canvasClickedY, setCanvasClickedY] = useState(0)
	const [triggerClick, setTriggerClick] = useState(0)

	return (
		<>
			<Navbar />
			<div id="body-content">
				<GameButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				<canvas id="my-canvas" onClick={(e) => { setClickPos(e.clientX, e.clientY, activeGame, triggerClick, setCanvasClickedX, setCanvasClickedY, setTriggerClick) }} ></canvas>
				<HandleBoard activeGame={activeGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} canvasClickedX={canvasClickedX} canvasClickedY={canvasClickedY} triggerClick={triggerClick} setCanvasClickedX={setCanvasClickedX} setCanvasClickedY={setCanvasClickedY} setTriggerClick={setTriggerClick} />
				<div id="right-side-elements">
					<div id="button-numbers-container">
						<button className="button-numbers">1</button>
						<button className="button-numbers">2</button>
						<button className="button-numbers">3</button>
						<button className="button-numbers">4</button>
						<button className="button-numbers">5</button>
						<button className="button-numbers">6</button>
						<button className="button-numbers">7</button>
						<button className="button-numbers">8</button>
						<button className="button-numbers">9</button>
					</div>
					{/* <div id="timer"></div> */}
				</div>
			</div>
		</>
	)
}

export default App;
