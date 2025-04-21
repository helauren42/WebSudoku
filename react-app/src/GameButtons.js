import { useEffect, useState } from "react";

const MODE_INSERT = "insert"
const MODE_NOTE = "note"

export const RightSideButtons = ({ activeGame, selectedCell, BOARD }) => {
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
			console.log("setting selected cell to clicked number")
			BOARD.updateCellValue(selectedCell["x"], selectedCell["y"], number)
		}
		else {
			console.log("adding note to selected cell")
			BOARD.updateCellNote(selectedCell["x"], selectedCell["y"], number)
		}
	}

	return (
		<div id="right-side-elements">
			<div id="game-interactions">
				<button className="playButtons" id="insert-mode" onClick={() => {
					insertMode == MODE_INSERT ? setInsertMode(MODE_NOTE) : setInsertMode(MODE_INSERT)
				}
				} >{insertMode}</button>
				<div id="button-numbers-container">
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>1</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>2</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>3</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>4</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>5</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>6</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>7</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>8</button>
					<button className="button-numbers" onClick={(e) => buttonNumberClick(e.target.innerText)}>9</button>
				</div>
				{/* <div id="timer"></div> */}
			</div>
		</div>
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
	)
}

