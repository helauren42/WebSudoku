import { PAGE_GAME, PAGE_ACCOUNT, PAGE_HOME, TITLES, PORT_SERVER } from './Const';
import { useState, useEffect } from 'react';
import { Sections } from './Const.js'
import './Account.css'

const SECTIONS = new Sections()

class AccountProfile {
	constructor() {
		this.reset()
	}
	reset() {
		this.username = undefined
		this.email = undefined
		this.hasPicture = false
		this.picturePath = undefined
		this.wins = undefined
		this.creationDay = undefined
		this.displayedUsername = undefined
		this.displayedEmail = undefined
	}
	/**
	* @param {string} name
	*/
	trimDisplay(name, max) {
		if (name.length > max)
			return name.substring(0, max) + "."
		return name;
	}
	login(username, email, wins, creationDay, hasPicture = false, picturePath = null) {
		console.log("account profile login")
		this.username = username
		this.email = email
		this.hasPicture = hasPicture
		this.picturePath = picturePath
		this.wins = wins
		this.creationDay = creationDay
		this.displayedUsername = this.trimDisplay(this.username, 18)
		this.displayedEmail = this.trimDisplay(this.email, 30)
	}
	logout() {
		this.reset()
	}
}

export const ACCOUNT_PROFILE = new AccountProfile()

const SignupSection = (({ currentSection, setCurrentSection, setLoggedIn }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")
	const [statusMessage, setStatusMessage] = useState("")
	const updateValue = (type, value) => {
		switch (type) {
			case "username":
				setUsername(value)
				break
			case "password":
				setPassword(value)
				break
			case "email":
				setEmail(value)
				break
		}
	}
	const submitSignup = (async (e) => {
		e.preventDefault()
		e.target.reset()
		const body = JSON.stringify({ username: username, password: password, email: email })
		const data = await fetch(`http://127.0.0.1:${PORT_SERVER}/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body
		}).then((response) => { console.log(response.headers.get("content-type")); return response.json() })
		const message = data["message"]
		const status = data["status"]
		const accountProfileData = data["accountProfile"]
		console.log(data)
		setStatusMessage(message)
		status == "success" ? console.log("signup successful") : console.log("signup error: ", message)
		setUsername("")
		setPassword("")
		setEmail("")
		if (status == "success") {
			setCurrentSection(SECTIONS.profile)
			setLoggedIn(true)
			ACCOUNT_PROFILE.login(accountProfileData.username, accountProfileData.email, accountProfileData.wins, accountProfileData.creationDay, accountProfileData.hasPicture, accountProfileData.picturePath,)
		}
	})
	return (
		<form className="account-form" onSubmit={(e) => submitSignup(e)} >
			<div className="account-form-section">
				<h3 className="account-input-header">Username</h3>
				<input className="account-input" required type="text" onChange={(e) => updateValue("username", e.target.value)} />
			</div>
			<div className="account-form-section">
				<h3 className="account-input-header">Password</h3>
				<input className="account-input" required type="text" onChange={(e) => updateValue("password", e.target.value)} />
			</div>
			<div className="account-form-section">
				<h3 className="account-input-header">Email</h3>
				<input className="account-input" required type="text" onChange={(e) => updateValue("email", e.target.value)} />
			</div>
			<div className="account-statusMessage">
				<p>{statusMessage}</p>
			</div>
			<button className="submit-button" >Submit</button>
			<p className="switch-login-signup" onClick={() => setCurrentSection(SECTIONS.login)}>click here to login</p>
		</form >
	)
})

const ProfileSection = (({ currentSection, setCurrentSection, setLoggedIn }) => {
	if (ACCOUNT_PROFILE.username == undefined) {
		ACCOUNT_PROFILE.login("Somebody", "Someone's@email.com", 0, [2024, 3, 3])
	}
	console.log(ACCOUNT_PROFILE)
	return (
		<div id="profile-container">
			<div className="profile-line">
				<h2 id="profile-username">{ACCOUNT_PROFILE.displayedUsername}</h2>
				<h2 id="profile-wins">{ACCOUNT_PROFILE.wins} wins</h2>
			</div>
			<div className="profile-line">
				<h2>Creation: </h2>
				<h2>{ACCOUNT_PROFILE.creationDay[2]}-{ACCOUNT_PROFILE.creationDay[1]}-{ACCOUNT_PROFILE.creationDay[0]} </h2>
			</div>
			<div className="profile-line">
				<h2>Email: </h2>
				<h2 id="profile-email">{ACCOUNT_PROFILE.displayedEmail}</h2>
			</div>
			<button id="profile-logout" onClick={() => {
				setCurrentSection(SECTIONS.login); setLoggedIn(false); ACCOUNT_PROFILE.reset();
			}}>logout</button>
		</div>
	)
})

const LoginSection = (({ currentSection, setCurrentSection, setLoggedIn }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [statusMessage, setStatusMessage] = useState("")
	const handleInputChange = ((e, type) => {
		if (type == "username")
			setUsername(e.target.value)
		else if (type == "password")
			setPassword(e.target.value)
	})
	const submitLogin = async (e) => {
		console.log("submitting login");
		e.preventDefault()
		e.target.reset()
		const data = await fetch("http://127.0.0.1:5463/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		}).then((response) => response.json())
		console.log(data)
		if (data["message"] == "success") {
			console.log("Login successful:", data);
			setLoggedIn(true)
			setCurrentSection(SECTIONS.profile)
			const accountProfileData = data["accountProfile"]
			ACCOUNT_PROFILE.login(accountProfileData.username, accountProfileData.email, accountProfileData.wins, accountProfileData.creationDay, accountProfileData.hasPicture, accountProfileData.picturePath,)
		}
		else {
			console.log("Login error:", data);
			const msg = data["message"]
			setStatusMessage(msg)
		}
	}
	return (
		<form className="account-form" onSubmit={(e) => { submitLogin(e) }}>
			<div className="account-form-section">
				<h3 className="account-input-header">Username</h3>
				<input className="account-input" required type="text" onChange={(e) => handleInputChange(e, "username")} />
			</div>
			<div className="account-form-section">
				<h3 className="account-input-header">Password</h3>
				<input className="account-input" required type="text" onChange={(e) => handleInputChange(e, "password")} />
			</div>
			<div className="account-statusMessage">
				<p>{statusMessage}</p>
			</div>
			<button className="submit-button" >Submit</button>
			<p className="switch-login-signup" onClick={() => setCurrentSection(SECTIONS.signup)}>click here to signup</p>
		</form>
	)
})

const GetSection = (({ currentSection, setCurrentSection, setLoggedIn }) => {
	console.log("get section: ", currentSection)
	if (currentSection == SECTIONS.login) {
		return (
			<div id="account-body">
				<LoginSection currentSection={currentSection} setCurrentSection={setCurrentSection} setLoggedIn={setLoggedIn} />
			</div>
		)
	}
	if (currentSection == SECTIONS.signup) {
		return (
			<div id="account-body">
				<SignupSection currentSection={currentSection} setCurrentSection={setCurrentSection} setLoggedIn={setLoggedIn} />
			</div>
		)
	}
	if (currentSection == SECTIONS.profile) {
		return (
			<div id="account-body">
				<ProfileSection currentSection={currentSection} setCurrentSection={setCurrentSection} setLoggedIn={setLoggedIn} />
			</div>
		)
	}
})

export const Account = ({ loggedIn, setLoggedIn }) => {
	const [currentSection, setCurrentSection] = useState(loggedIn == true ? SECTIONS.profile : SECTIONS.login)

	return (
		<div id="parent">
			<div id="account">
				<h1 id="account-head">{TITLES[currentSection]}</h1>
				<GetSection currentSection={currentSection} setCurrentSection={setCurrentSection} setLoggedIn={setLoggedIn} />
			</div>
		</div>
	)
}

