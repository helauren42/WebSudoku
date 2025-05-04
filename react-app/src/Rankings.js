import { useState, useEffect } from 'react';
import { SOCKET_ADDRESS } from './Const';
import './Rankings.css'

const RankingsTable = ({ period, periodName }) => {
	const makeRankingsTable = async () => {
		console.log("ey: ", period)
		const rankings = await fetch(`http://${SOCKET_ADDRESS}/getRankings/${period}`, {
			headers: {
				"Content-type": "application/json"
			}

		}).then((resp) => resp.json())
		console.log("fetched rankings: ", rankings)
		console.log("fetched rankings: ", typeof (rankings))
		let table = document.getElementById(`rankings-table-${period}`)
		for (let i = 0; i < 50; i++) {
			if (!rankings || !rankings[i])
				break
			let row = table.insertRow();
			let name = rankings[i][0]
			name = name.length > 20 ? name.substring(0, 20) + "." : name
			row.insertCell().textContent = name
			row.insertCell().textContent = rankings[i][1]
		}
	}
	useEffect(() => {
		console.log("YOOO")
		makeRankingsTable()
	}, [])
	return (
		<div className="rankings-column">
			<h3 className="ranking-title" id="rankings-menu-button-0" >{periodName}</h3>
			<table id={`rankings-table-${period}`} >
				<thead>
					<tr>
						<th>username</th>
						<th>points</th>
					</tr>
				</thead>
			</table >
		</div>
	)
}

export const RankingsPage = () => {
	return (
		<div id="rankings-page">
			<RankingsTable period={0} periodName={"daily"} />
			<RankingsTable period={1} periodName={"weekly"} />
			<RankingsTable period={2} periodName={"all time"} />
		</div >
	)
}


