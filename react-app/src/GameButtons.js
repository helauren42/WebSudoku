import { useEffect, useState } from "react";

const MODE_INSERT = "insert"
const MODE_NOTE = "note"

export const RightSideButtons = ({ activeGame, selectedCell, BOARD, submitPuzzle, setSubmitPuzzle }) => {
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
	useEffect(() => {
		if (submitPuzzle == false)
			return
		const messages = document.getElementById("message-content")
		if (!BOARD.noEmptyCell()) {
			messages.textContent = "Finish the puzzle before submitting"
			setSubmitPuzzle(false)
			return
		}
		const errorCount = BOARD.countErrors()
		const conflictCount = BOARD.countConflicts()
		if (conflictCount > 0) {
			const errors = errorCount == 1 ? "error" : "errors"
			const conflicts = conflictCount == 1 ? "conflict" : "conflicts"
			const elem = document.getElementById("popup-message-content")
			elem.textContent = `You have ${errorCount} ${errors} and ${conflictCount} ${conflicts} in your solution`
			setSubmitPuzzle(false)
			return
		}
		setSubmitPuzzle(false)
	}, [submitPuzzle])

	return (
		<div id="right-side-elements">
			<div id="game-interactions">
				<button className="playButtons" id="insert-mode" onClick={() => {
					insertMode == MODE_INSERT ? setInsertMode(MODE_NOTE) : setInsertMode(MODE_INSERT)
				}
				} >{insertMode}</button>
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

export const LeftSideButtons = ({ activeGame, setActiveGame, currentLevel, setCurrentLevel }) => {
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

	return (
		<div id="left-side">
			{/* <h4 id="popup-title"><u>Help</u></h4> */}
			<p id="messages"><i id="popup-message-content"></i></p>
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
		</div>
	)
}

