import { useEffect, useState } from "react";

import { HandleBoard, BOARD, setClickPos } from './HandleBoard';
import { Account, ACCOUNT_PROFILE } from "./Account";

const MODE_INSERT = "insert"
const MODE_NOTE = "note"

export const RightSideButtons = ({ activeGame, selectedCell, BOARD, submitPuzzle, setSubmitPuzzle, loggedIn }) => {
	const [insertMode, setInsertMode] = useState(MODE_INSERT)
	const buttonNumberClick = (stringNum) => {
		const number = parseInt(stringNum)
		console.log("clicked: ", number)
		console.log("type: ", typeof (number))
		if (!activeGame || !selectedCell) {
			if (!activeGame)
				console.log("game not active")
			if (!selectedCell)
				console.log("no selected cell")
			return
		}
		if (insertMode == MODE_INSERT) {
			BOARD.updateCellValue(selectedCell["x"], selectedCell["y"], number)
		}
		else {
			BOARD.updateCellNote(selectedCell["x"], selectedCell["y"], number)
		}
	}
	const addPointsToAccount = (async () => {
		const points = BOARD.passSubmission()
		await ACCOUNT_PROFILE.addTempPoints(points)
	})
	useEffect(() => {
		console.log("submit puzzle effect(): ", submitPuzzle)
		const popup = document.getElementById("submit-puzzle")
		if (submitPuzzle == false) {
			popup.style.display = "none"
			return
		}
		console.log("get messages element by id")
		const messages = document.getElementById("error-message-content")
		popup.style.display = "flex"
		popup.close()
		popup.showModal()
		addPointsToAccount()
		return
		if (BOARD.hasEmptyCell()) {
			console.log("has empty cell")
			messages.textContent = "Finish the puzzle before submitting"
			return
		}
		const errorCount = BOARD.countErrors()
		const conflictCount = BOARD.countConflicts()
		if (conflictCount > 0) {
			const errors = errorCount == 1 ? "error" : "errors"
			const conflicts = conflictCount == 1 ? "conflict" : "conflicts"
			const elem = document.getElementById("error-message-content")
			elem.textContent = `You have ${errorCount} ${errors} and ${conflictCount} ${conflicts} in your solution`
		}
		else {
			addPointsToAccount()
		}
	}, [submitPuzzle])

	return (
		<div id="right-side-elements">
			<div id="game-interactions">
				<button className="playButtons" id="insert-mode" onClick={() => {
					insertMode == MODE_INSERT ? setInsertMode(MODE_NOTE) : setInsertMode(MODE_INSERT)
				}} >{insertMode}</button>
				<div id="button-numbers-container">
					<button className="button-numbers" id="button-number-1" onClick={(e) => buttonNumberClick(e.target.innerText)}>1</button>
					<button className="button-numbers" id="button-number-2" onClick={(e) => buttonNumberClick(e.target.innerText)}>2</button>
					<button className="button-numbers" id="button-number-3" onClick={(e) => buttonNumberClick(e.target.innerText)}>3</button>
					<button className="button-numbers" id="button-number-4" onClick={(e) => buttonNumberClick(e.target.innerText)}>4</button>
					<button className="button-numbers" id="button-number-5" onClick={(e) => buttonNumberClick(e.target.innerText)}>5</button>
					<button className="button-numbers" id="button-number-6" onClick={(e) => buttonNumberClick(e.target.innerText)}>6</button>
					<button className="button-numbers" id="button-number-7" onClick={(e) => buttonNumberClick(e.target.innerText)}>7</button>
					<button className="button-numbers" id="button-number-8" onClick={(e) => buttonNumberClick(e.target.innerText)}>8</button>
					<button className="button-numbers" id="button-number-9" onClick={(e) => buttonNumberClick(e.target.innerText)}>9</button>
				</div>
				<button className="playButtons" id="submit-solution" onClick={() => setSubmitPuzzle(true)} > Submit</button>
				{/* <div id="timer"></div> */}
			</div>
		</div >
	)
}

export const LeftSideButtons = ({ activeGame, setActiveGame, currentLevel, setCurrentLevel, setSubmitPuzzle }) => {
	function updateLevel(e) {
		console.log("updating level: ", e.target.value)
		switch (e.target.value) {
			case "Easy":
				setCurrentLevel(0)
				break
			case "Medium":
				setCurrentLevel(1)
				break
			case "Hard":
				setCurrentLevel(2)
				break
			case "Extreme":
				setCurrentLevel(3)
				break
			default:
				break
		}
	}

	useEffect(() => {
		const submitElem = document.getElementById("submit-puzzle")
		submitElem.close()
		submitElem.show()
	})
	return (
		<div id="left-side">
			<dialog id="submit-puzzle">
				<div id="submit-puzzle-nav">
					<h4 ></h4>
					<h2 id="submit-puzzle-title" ><u>Submission</u></h2>
					<button id="submit-puzzle-cross" onClick={() => setSubmitPuzzle(false)}>X</button>
				</div>
				<p id="messages"><i id="error-message-content"></i></p>
				<h5></h5>
			</dialog>
			<div id="game-mode-buttons">
				<select id="select-difficulty" className="playButtons" onChange={(e) => updateLevel(e)}>
					<option value="Easy">Easy</option>
					<option value="Medium">Medium</option>
					<option value="Hard">Hard</option>
					<option value="Extreme">Extreme</option>
				</select>
				{
					!activeGame && (
						<button id="start" className="playButtons" onClick={() => setActiveGame(true)} > Start </button>
					)
				}
				{
					activeGame && (
						<button className="playButtons" onClick={() => setActiveGame(false)} > Give Up </button>
					)
				}
			</div >
		</div >
	)
}

export const GamePage = ({ gameState }) => {
	const {
		loggedIn, setLoggedIn,
		activeGame, setActiveGame,
		currentLevel, setCurrentLevel,
		canvasClickedX, setCanvasClickedX,
		canvasClickedY, setCanvasClickedY,
		triggerClick, setTriggerClick,
		selectedCell, setSelectedCell,
		currentPage, setCurrentPage,
		submitPuzzle, setSubmitPuzzle
	} = gameState;
	return (
		<>
			< div id="game-page" >
				<LeftSideButtons activeGame={activeGame} setActiveGame={setActiveGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} setSubmitPuzzle={setSubmitPuzzle} />
				<div id="my-canvas-container">
					<canvas id="my-canvas" onClick={(e) => { setClickPos(e.clientX, e.clientY, activeGame, triggerClick, setCanvasClickedX, setCanvasClickedY, setTriggerClick) }} ></canvas>
				</div>
				<HandleBoard activeGame={activeGame} currentLevel={currentLevel} setCurrentLevel={setCurrentLevel} canvasClickedX={canvasClickedX} canvasClickedY={canvasClickedY} triggerClick={triggerClick} setCanvasClickedX={setCanvasClickedX} setCanvasClickedY={setCanvasClickedY} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
				<RightSideButtons activeGame={activeGame} selectedCell={selectedCell} BOARD={BOARD} submitPuzzle={submitPuzzle} setSubmitPuzzle={setSubmitPuzzle} loggedIn={loggedIn} />
			</div>
		</>
	)
}
