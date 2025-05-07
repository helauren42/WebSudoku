import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { Account, ACCOUNT_PROFILE } from './Account.js';
import { GamePage } from './GameButtons.js'
import { RankingsPage } from './Rankings';
import './App.css'
import './GamePage.css'
import { SOCKET_ADDRESS } from './Const';

import { PAGE_GAME, PAGE_ACCOUNT, PAGE_HOME, PAGE_GAME_FINISHED, Sections, PAGE_RANKINGS } from './Const';

const HomePage = ({ setCurrentPage }) => {
	return (
		<div id="home-page">
			<div id="help-section">
				<div className='help-subsection' id="points-section">
					<h2>Points System</h2>
					<p className='help-paragraph'>
						Easy: 50<br />
						Medium: 90<br />
						Hard: 300<br />
						Extreme: 1200<br />
					</p>
				</div>
				<div className='help-subsection' id="keymap-section">
					<h2>Keymaps</h2>
					<p className='help-paragraph'>&lt;i&gt;: Toggle between insert and notes mode<br />
						&lt;arrow keys&gt;: Move around the selection of a cell<br />
						&lt;1-9&gt;: Input number into the cell depends on insert or notes mode<br />
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
	const [submitPuzzle, setSubmitPuzzle] = useState(false)
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
		setCurrentPage,
		submitPuzzle,
		setSubmitPuzzle
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
			{
				gameState.currentPage == PAGE_RANKINGS &&
				<RankingsPage />
			}

		</>
	)
}

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [currentPage, setCurrentPage] = useState(PAGE_HOME)
	console.log('Current Page1:', currentPage);
	console.log("cookies: ", document.cookie)
	console.log("cookies: ", typeof (document.cookie))

	const getUserSessionToken = (cookiestring) => {
		cookiestring = cookiestring.replace(";", "")
		const split_elements = cookiestring.split(" ")
		for (let i = 0; i < split_elements.length; i++) {
			const keyValue = split_elements[i].split("=")
			if (keyValue[0] == "userSessionToken") {
				return keyValue[1]
			}
		}
	}
	const loginWithCookie = async (cookiestring) => {
		const userSessionToken = getUserSessionToken(cookiestring)
		console.log("user session token: ", userSessionToken)
		const data = await fetch(`http://${SOCKET_ADDRESS}/userData`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${userSessionToken}`
			},
			credentials: 'include',
		}).then((response) => {
			console.log("resp: ", response)
			return response.json()
		}).catch((resp) => {
			console.log(resp)
		})
		if (data["status"] == "success") {
			const accountProfileData = data["accountProfile"]
			console.log("accountProfileData:", accountProfileData)
			ACCOUNT_PROFILE.login(accountProfileData.username, accountProfileData.email, accountProfileData.totalPoints, accountProfileData.creationDay, accountProfileData.hasPicture, accountProfileData.picturePath)
			setLoggedIn(true)
		}
		else {
			console.log(data["message"])
		}
	}

	useEffect(() => {
		const cookiestring = document.cookie
		if (cookiestring.search("sessionId") < 0) {
			const token = crypto.randomUUID()
			document.cookie = `sessionId=${token} SameSite=lax path=/`
		}
		if (cookiestring.search("userSessionToken") > 0) {
			loginWithCookie(cookiestring)
		}
	})
	return (
		<>
			<Navbar setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Router currentPage={currentPage} setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
		</>
	)
}

export default App;
