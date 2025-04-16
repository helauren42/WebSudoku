import { useEffect } from "react";
import { GameState } from "./Const";

export const GameButtons = ({ activeGame, setActiveGame, currentLevel, setCurrentLevel }) => {
	useEffect(() => {
		const bodyContent = document.getElementById("body-content")
		const gameButtons = document.getElementById('game-buttons');

		console.log(`${activeGame ? "active game" : "no active game"}`)
		if (window.innerHeight > window.innerWidth) {
			bodyContent.style.flexDirection = 'column'
			gameButtons.style.flexDirection = 'row'
		} else {
			bodyContent.style.flexDirection = 'row'
			gameButtons.style.flexDirection = 'column'
		}
	}, [activeGame])

	function updateLevel(e) {
		console.log("updating level: ", e.target.value)
		switch (e.target.value) {
			case "Easy":
				setCurrentLevel(GameState.EASY)
				break
			case "Medium":
				setCurrentLevel(GameState.MEDIUM)
				break
			case "Hard":
				setCurrentLevel(GameState.Hard)
				break
			default:
				break
		}
	}

	return (
		<div id="game-buttons">
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
			<select id="select-difficulty" className="playButtons" onChange={(e) => updateLevel(e)}>
				<option value="Easy">Easy</option>
				<option value="Medium">Medium</option>
				<option value="Hard">Hard</option>
			</select>
		</div >
	)
}

