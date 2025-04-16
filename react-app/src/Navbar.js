import './Navbar.css'
import UserIcon from './imgs/user.svg'
import { PROJECT_SRC } from './Const.js'
import { useState, useEffect } from 'react';

const userIcon = `${PROJECT_SRC}imgs/user.svg`

console.log(userIcon)

function setUserSectionWidth() {
	let user_section = document.getElementById('user-section')
	let title = document.getElementById('title')
	let titleRect = title.getBoundingClientRect()
	let width = titleRect.width
	// user_section.setAttribute('width', width)
	user_section.style.width = `${width}px`;
}

export const Navbar = () => {
	const [loggedin, setLoggedin] = useState(false)

	useEffect(() => {
		setUserSectionWidth()
		window.addEventListener('resize', setUserSectionWidth)
		return () => {
			window.removeEventListener('resize', setUserSectionWidth)
		}
	}, [])

	return (
		<div id="navbar">
			<h1 id="title">Sudoku</h1>
			<div id="nav-menu">
				<button className='nav-button'>Rankings</button>
				<button className='nav-button'>Quick Game</button>
			</div>
			<div id="user-section">
				<img id="user-icon" src={UserIcon}></img>
				<p id="user-text">{loggedin ? 'account' : 'login'}</p>
			</div>
		</div >
	)
}

// export { Navbar }
