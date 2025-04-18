import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { HandleBoard } from './HandleBoard';
import { GameButtons } from './GameButtons.js'
import { GameState } from "./Const";
import './App.css'

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	const [currentLevel, setCurrentLevel] = useState(GameState.EASY)
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
