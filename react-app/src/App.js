import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Account } from './Account.js';
import { HandleBoard, BOARD, setClickPos } from './HandleBoard';
import { LeftSideButtons, RightSideButtons } from './GameButtons.js'
import './App.css'
import './GamePage.css'

import { PAGE_GAME, PAGE_ACCOUNT, PAGE_HOME, PAGE_GAME_FINISHED, Sections } from './Const';

const GamePage = ({ gameState }) => {
	const {
		activeGame, setActiveGame,
		currentLevel, setCurrentLevel,
		canvasClickedX, setCanvasClickedX,
		canvasClickedY, setCanvasClickedY,
		triggerClick, setTriggerClick,
		selectedCell, setSelectedCell,
		currentPage, setCurrentPage
	} = gameState;
	return (
		<>
			< div id="game-page" >
				<LeftSideButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
				<div id="my-canvas-container">
					<canvas id="my-canvas" onClick={(e) => { setClickPos(e.clientX, e.clientY, activeGame, triggerClick, setCanvasClickedX, setCanvasClickedY, setTriggerClick) }} ></canvas>
				</div>
				<HandleBoard activeGame={activeGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} canvasClickedX={canvasClickedX} canvasClickedY={canvasClickedY} triggerClick={triggerClick} setCanvasClickedX={setCanvasClickedX} setCanvasClickedY={setCanvasClickedY} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
				<RightSideButtons activeGame={activeGame} selectedCell={selectedCell} BOARD={BOARD} />
			</div>
		</>
	)
}

const HomePage = ({ setCurrentPage }) => {
	return (
		<div id="home-page">
			<div id="help-section">
				<div className='help-subsection' id="points-section">
					<h2>Points System</h2>
					<p className='help-paragraph'>Base points per difficulty:<br />
						Easy: 50<br />
						Medium: 90<br />
						Hard: 300<br />
						Extreme: 1200<br />
					</p>
				</div>
				<div className='help-subsection' id="keymap-section">
					<h2>Keymaps</h2>
					<p className='help-paragraph'>&lt;i&gt;: Toggle between insert and notes mode<br />
						&lt;arrow keys&gt;: Move around the selection of a cell
					</p>
				</div>
			</div>
			<div id="home-board">
				<h1 id="home-play" onClick={() => setCurrentPage(PAGE_GAME)}>Play Here</h1>
			</div>
		</div >
	)
}

const Router = ({ currentPage, setCurrentPage, loggedIn, setLoggedIn }) => {
	const [activeGame, setActiveGame] = useState(false)
	const [currentLevel, setCurrentLevel] = useState(0)
	const [canvasClickedX, setCanvasClickedX] = useState(0)
	const [canvasClickedY, setCanvasClickedY] = useState(0)
	const [triggerClick, setTriggerClick] = useState(0)
	const [selectedCell, setSelectedCell] = useState(null)
	const gameState = {
		loggedIn,
		setLoggedIn,
		activeGame,
		setActiveGame,
		currentLevel,
		setCurrentLevel,
		canvasClickedX,
		setCanvasClickedX,
		canvasClickedY,
		setCanvasClickedY,
		triggerClick,
		setTriggerClick,
		selectedCell,
		setSelectedCell,
		currentPage,
		setCurrentPage
	};

	return (
		<>
			{
				gameState.currentPage == PAGE_GAME &&
				<GamePage gameState={gameState} />
			}
			{
				gameState.currentPage == PAGE_ACCOUNT &&
				<Account loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			}
			{
				gameState.currentPage == PAGE_HOME &&
				<HomePage setCurrentPage={setCurrentPage} />
			}
		</>
	)
}

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [currentPage, setCurrentPage] = useState(PAGE_HOME)
	console.log('Current Page1:', currentPage);
	return (
		<>
			<Navbar setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Router currentPage={currentPage} setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
		</>
	)
}

export default App;
