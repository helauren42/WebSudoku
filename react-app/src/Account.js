import { PAGE_GAME, PAGE_ACCOUNT, PAGE_HOME, TITLES } from './Const';
import { useState, useEffect } from 'react';
import { Sections } from './Const.js'
import './Account.css'

const SECTIONS = new Sections()


const SignupSection = (({ currentSection, setCurrentSection }) => {
	const [signupFormData, setSignupFormData] = useState({
		username: "",
		password: "",
		email: ""
	})
	const submitSignup = (() => {

	})
	return (
		<form onSubmit={() => submitSignup} id="account-form">
			<div className="account-form-section">
				<h2 className="account-input-header">Username</h2>
				<input className="account-input" type="text" value={signupFormData.username} />
			</div>
			<div className="account-form-section">
				<h2 className="account-input-header">Password</h2>
				<input className="account-input" type="text" value={signupFormData.password} />
			</div>
			<div className="account-form-section">
				<h2 className="account-input-header">Email</h2>
				<input className="account-input" type="text" value={signupFormData.email} />
			</div>
			<button className="submit-button">Submit</button>
			<p className="switch-login-signup" onClick={() => setCurrentSection(SECTIONS.login)}>click here to login</p>
		</form>
	)
})

const LoginSection = (({ currentSection, setCurrentSection, setLoggedIn }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [submission, setSubmission] = useState(false)
	const handleInputChange = ((e, type) => {
		console.log("targt value: ", e.target.value)
		if (type == "username")
			setUsername(e.target.value)
		else if (type == "password")
			setPassword(e.target.value)
		console.log(username)
		console.log(password)
	})
	useEffect(() => {
		console.log("submitting login")
		console.log(username)
		console.log(password)
		setSubmission(false)
		fetch("http://127.0.0.1:5463/")
	}, [submission])
	return (
		<form id="account-form">
			<div className="account-form-section">
				<h3 className="account-input-header">Username</h3>
				<input className="account-input" required type="text" onChange={(e) => handleInputChange(e, "username")} />
			</div>
			<div className="account-form-section">
				<h3 className="account-input-header">Password</h3>
				<input className="account-input" required type="text" onChange={(e) => handleInputChange(e, "password")} />
			</div>
			<button className="submit-button" onClick={(e) => { setSubmission(true); e.preventDefault() }}>Submit</button>
			<p className="switch-login-signup" onClick={() => setCurrentSection(SECTIONS.signup)}>click here to signup</p>
		</form>
	)
})

const GetSection = (({ currentSection, setCurrentSection }) => {
	console.log("get section: ", currentSection)
	console.log(SECTIONS.login)
	if (currentSection == SECTIONS.login) {
		return (
			<div id="account-body">
				<LoginSection />
			</div>
		)
	}
})

export const Account = (loggedIn, setLoggedIn) => {
	const [currentSection, setCurrentSection] = useState(loggedIn == true ? SECTIONS.profile : SECTIONS.login)

	useEffect(() => {

	}, [currentSection])
	return (
		<div id="parent">
			<div id="account">
				<h1 id="account-head">{TITLES[currentSection]}</h1>
				<GetSection currentSection={currentSection} setCurrentSection={setCurrentSection} setLoggedIn={setLoggedIn} />
			</div>
		</div>
	)
}

