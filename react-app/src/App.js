import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { HandleBoard } from './HandleBoard';
import { GameButtons } from './GameButtons.js'
import './App.css'

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	const [clickedX, setClickedX] = useState(0)
	const [clickedY, setClickedY] = useState(0)
	const [currentLevel, setCurrentLevel] = useState(0)
	return (
		<>
			<Navbar />
			<div id="body-content">
				<GameButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				<canvas id="my-canvas"></canvas>
				<HandleBoard activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				<canvas id="timer-canvas"></canvas>
			</div>
		</>
	)
}

export default App;
