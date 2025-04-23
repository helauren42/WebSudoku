import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Account } from './Account.js';
import { HandleBoard, BOARD, setClickPos } from './HandleBoard';
import { LeftSideButtons, RightSideButtons } from './GameButtons.js'
import './App.css'
import './GamePage.css'
import { PAGE_GAME, PAGE_ACCOUNT, PAGE_HOME, PAGE_GAME_FINISHED } from './Const';

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

const Router = ({ gameState }) => {
	const {
		loggedIn, setLoggedIn,
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
			{
				gameState.currentPage == PAGE_GAME &&
				<GamePage gameState={gameState} />
			}
			{
				gameState.currentPage == PAGE_ACCOUNT &&
				<Account loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			}
		</>
	)
}

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [activeGame, setActiveGame] = useState(false)
	const [currentLevel, setCurrentLevel] = useState(0)
	const [canvasClickedX, setCanvasClickedX] = useState(0)
	const [canvasClickedY, setCanvasClickedY] = useState(0)
	const [triggerClick, setTriggerClick] = useState(0)
	const [selectedCell, setSelectedCell] = useState(null)
	const [currentPage, setCurrentPage] = useState(PAGE_GAME)
	const gameState = {
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
	console.log('Current Page1:', currentPage);
	console.log('Game State1:', gameState);
	return (
		<>
			<Navbar setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Router gameState={gameState} />
		</>
	)
}

export default App;
