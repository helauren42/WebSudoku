import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { HandleBoard } from './HandleBoard';
import './App.css'

const GameButtons = () => {
	const [active, setActive] = useState(false)
	useEffect(() => {
		const gameItems = document.getElementById('game-items');
		const startRestart = document.getElementById('start-restart');
		const canvas = document.getElementById('my-canvas');

		if (!canvas || !gameItems || !startRestart) return; // Guard against null elements

		if (window.innerHeight > window.innerWidth) {
			// Mobile app logic
			gameItems.style.flexDirection = 'column'
		} else {
			// Calculate position
			gameItems.style.flexDirection = 'row'
			startRestart.style.top = "50%"

		}
	}, []) // Empty dependency array is fine since this runs once on mount

	return (
		<div id="game-items">
			<button id="start-restart">{active ? 'restart' : 'start'}</button>
			{/* <select id="select-difficulty"> */}
			{/* 	<option value="Easy">Easy</option> */}
			{/* 	<option value="Intermediate">Intermediate</option> */}
			{/* 	<option value="Advanced">Advanced</option> */}
			{/* </select> */}
		</div>
	)
}

const App = () => {
	return (
		<>
			<Navbar />
			<div id="body-content">
				<GameButtons />
				<HandleBoard />
				<canvas id="timer-canvas"></canvas>
			</div>
		</>
	)
}

export default App;

