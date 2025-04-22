import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Board } from './Board.js';
import { HandleBoard, BOARD, setClickPos } from './HandleBoard';
import { LeftSideButtons, RightSideButtons } from './GameButtons.js'
import './App.css'
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
			<LeftSideButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} />
			<div id="my-canvas-container">
				<canvas id="my-canvas" onClick={(e) => { setClickPos(e.clientX, e.clientY, activeGame, triggerClick, setCanvasClickedX, setCanvasClickedY, setTriggerClick) }} ></canvas>
			</div>
			<HandleBoard activeGame={activeGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} canvasClickedX={canvasClickedX} canvasClickedY={canvasClickedY} triggerClick={triggerClick} setCanvasClickedX={setCanvasClickedX} setCanvasClickedY={setCanvasClickedY} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
			<RightSideButtons activeGame={activeGame} selectedCell={selectedCell} BOARD={BOARD} />
		</>
	)
}

const Router = ({ gameState }) => {
	const {
		activeGame, setActiveGame,
		currentLevel, setCurrentLevel,
		canvasClickedX, setCanvasClickedX,
		canvasClickedY, setCanvasClickedY,
		triggerClick, setTriggerClick,
		selectedCell, setSelectedCell,
		currentPage, setCurrentPage
	} = gameState;
	console.log('Current Page:', gameState.currentPage);
	console.log('Game State2:', gameState);
	return (
		<div id="body-content">
			{
				gameState.currentPage == PAGE_GAME &&
				<GamePage gameState={gameState} />
			}
		</div>
	)
}

const App = () => {

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
			<Navbar setCurrentPage={setCurrentPage} />
			<Router gameState={gameState} />
		</>
	)
}

export default App;
