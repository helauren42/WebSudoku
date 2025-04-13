import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { HandleBoard } from './HandleBoard';
import './App.css'

const GameButtons = ({ activeGame }) => {
	useEffect(() => {
		const bodyContent = document.getElementById("body-content")
		const gameButtons = document.getElementById('game-buttons');
		const startRestart = document.getElementById('start-restart');
		const selectDifficulty = document.getElementById('select-difficulty');

		startRestart.classList.add("playButtons")
		selectDifficulty.classList.add("playButtons")

		if (window.innerHeight > window.innerWidth) {
			// Mobile app logic
			bodyContent.style.flexDirection = 'column'
			gameButtons.style.flexDirection = 'row'
		} else {
			bodyContent.style.flexDirection = 'row'
			gameButtons.style.flexDirection = 'column'
			startRestart.style.top = "50%"
		}
		// startRestart.addEventListener(() => {
		//
		// })
	}, [])

	return (
		<div id="game-buttons">
			<button id="start-restart">{activeGame ? 'Restart' : 'Start'}</button>
			<select id="select-difficulty">
				<option value="Easy">Easy</option>
				<option value="Intermediate">Intermediate</option>
				<option value="Advanced">Advanced</option>
			</select>
		</div>
	)
}

const App = () => {
	const [activeGame, setActiveGame] = useState(false)
	return (
		<>
			<Navbar />
			<div id="body-content">
				<GameButtons active={activeGame} setActive{...setActiveGame} />
				<canvas id="my-canvas"></canvas>
				<HandleBoard active={activeGame} setActive{...setActiveGame} />
				<canvas id="timer-canvas"></canvas>
			</div>
		</>
	)
}

export default App;

