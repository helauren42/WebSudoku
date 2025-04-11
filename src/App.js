import { useState, useEffect } from 'react';

import './App.css'
import { PROJECT_SRC } from './Const.js'
import UserIcon from './imgs/user.svg'
console.log(PROJECT_SRC)

const userIcon = `${PROJECT_SRC}imgs/user.svg`

console.log(userIcon)

const Navbar = () => {
	const [loggedin, setLoggedin] = useState(false)

	return (
		<div id="navbar">
			<h1 id="title">Sudoku</h1>
			<div id="nav-menu">
				<button className='nav-button'>Play</button>
				<button className='nav-button'>Rankings</button>
			</div>
			<div id="user-section">
				<img id="user-icon" src={UserIcon}></img>
				<p id="">{loggedin ? 'account' : 'login'}</p>
			</div>
		</div >
	)
}

const App = () => {
	return (
		<Navbar />
	)
}

export default App;

