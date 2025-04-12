// import { useState, useEffect } from 'react';
import { Navbar, setUserSectionWidth } from './Navbar';
import { HandleBoard } from './HandleBoard';
import './App.css'

const App = () => {
	return (
		<>
			<Navbar />
			<div id="body-content">
				<HandleBoard />
				{/* <GameButtons /> */}
			</div>
		</>
	)
}

export default App;

