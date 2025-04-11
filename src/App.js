import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import './App.css'

const Board = () => {
	const [active, setActive] = useState(false)

	return (
		<div>

		</div>
	)

}

const App = () => {
	return (
		<>
			<Navbar />
			<Board />
		</>
	)
}

export default App;

