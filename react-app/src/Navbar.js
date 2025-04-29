import './Navbar.css'
import { useState, useEffect } from 'react';

import { ACCOUNT_PROFILE } from './Account.js';
import { PROJECT_SRC } from './Const.js'
import { PAGE_GAME, PAGE_ACCOUNT, PAGE_HOME } from './Const';
import UserIcon from './imgs/user.svg'

function setUserSectionWidth() {
	let user_section = document.getElementById('user-section')
	let title = document.getElementById('title')
	let titleRect = title.getBoundingClientRect()
	let width = titleRect.width
	// user_section.setAttribute('width', width)
	user_section.style.width = `${width}px`;
}

export const Navbar = ({ setCurrentPage, loggedIn, setLoggedIn }) => {
	useEffect(() => {
		// setUserSectionWidth()
		window.addEventListener('resize', setUserSectionWidth)
		return () => {
			window.removeEventListener('resize', setUserSectionWidth)
		}
	}, [])

	return (
		<div id="navbar">
			<div id="navbar-elements">
				<h1 id="title" onClick={() => setCurrentPage(PAGE_HOME)}>Sudoku</h1>
				<div id="nav-menu">
					<button className='nav-button'>Rankings</button>
					<button className='nav-button' onClick={() => setCurrentPage(PAGE_GAME)} >Play</button>
				</div>
				<div id="user-section" onClick={() => setCurrentPage(PAGE_ACCOUNT)}>
					<img id="user-icon" src={UserIcon}></img>
					<p id="user-text">{loggedIn ? 'account' : 'login'}</p>
				</div>
			</div>
		</div >
	)
}
