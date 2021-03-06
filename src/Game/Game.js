import s from './Game.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from 'antd'
import ClubTable from './СlubTable'
import TabloMatches from './TabloMatches'
import Loader from '../Loader/Loader'
import { message } from 'antd'
import HeaderMenu from '../HeaderMenu/HeaderMenu'

function Game(props) {
	const listTournamentTeams = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
	]
	const maxRound = 30
	const [isLoading, setIsLoading] = useState(true)
	const [round, setRound] = useState(1) // The round number that is played now
	const [yourTeam, setYourTeam] = useState('')
	const [clubOpponent, setClubOpponent] = useState(0) // Club rival id
	const [goalsFirstTeam, setGoalsFirstTeam] = useState(0)
	const [goalsSecondTeam, setGoalsSecondTeam] = useState(0)
	const [resultsGames, setResultsGames] = useState()
	const [infoClub, setInfoClub] = useState({
		id: 1,
		clubName: 'Liverpool',
		logotype: '/img/Liverpool.png',
	})

	const сompletionRown = () => {
		message
			.loading('Go games Round ..', 16.5)
			.then(() => message.success('Rounds are played', 4.5))
			.then(() =>
				message.info('Congratulations to the winners of the game ', 2.5)
			)
	}
	// The function displays the game of the tournament in the array of [1,2], [3,4] when you press the game "Game"
	// occurs a random selection of a team, where the winner is revealed to the "force" of the team, in case of a
	// draw when Conducted the game at home has a passenger program.
	function schedule(array, round) {
		if (!round) {
			var teams = array.length,
				halfTour = teams - 1,
				totalRounds = halfTour * 2,
				matchesPerRound = teams / 2,
				matches = [],
				rounds = [],
				match,
				home,
				away,
				swap
			for (round = 0; round < totalRounds; round++) {
				matches = []
				for (match = 0; match < matchesPerRound; match++) {
					home = (round + match) % (teams - 1)
					away = (teams - 1 - match + round) % (teams - 1)
					if (match === 0) {
						away = teams - 1
					}
					if (round >= halfTour) {
						swap = home
						home = away
						away = swap
					}
					matches.push([array[home], array[away]])
				}
				rounds.push(matches)
			}
			return rounds
		}
		return schedule(array)[round - 1]
	}

	useEffect(() => {
		fetch('/teams')
			.then(result => result.json())
			.then(result => {
				setInfoClub(result)
				setYourTeam(result[15]) // Information about your team
				setIsLoading(false)
			})
		fetch('/round')
			.then(result => result.json())
			.then(result => setRound(result.round))
		fetch('/gameChampionship')
			.then(result => result.json())
			.then(result => setResultsGames(result))
	}, [])

	function сhampionshipGames() {
		let totatorTournament = resultsGames
		if (round === maxRound) return alert('The tournament is completed ')
		let scheduleRound = schedule(listTournamentTeams, round)
		setRound(round + 1)
		nextRound() // Round Update
		сompletionRown()
		for (let i = 0; i < scheduleRound.length; i++) {
			let firstClub = scheduleRound[i][0]
			let secondClub = scheduleRound[i][1]
			let goalsTeamFirst = Math.floor(
				Math.random() * infoClub[firstClub - 1].force
			) // Random result of the game (taking into account the force of the team)
			let goalsTeamSecond = Math.floor(
				Math.random() * infoClub[secondClub - 1].force
			) // Random result of the game (taking into account the force of the team)
			if (firstClub === 16) {
				let firstTeamWin = setGoalsFirstTeam(Math.floor(goalsTeamFirst / 100))
				let secondTeamWin = setGoalsSecondTeam(
					Math.floor(goalsTeamSecond / 100)
				)
				setClubOpponent(secondClub)
				if (firstTeamWin > secondTeamWin) {
					totatorTournament[round - 1] = true
					setResultsGames(totatorTournament)
					makeResultTable(totatorTournament)
				} else {
					totatorTournament[round - 1] = false
					setResultsGames(totatorTournament)
					makeResultTable(totatorTournament)
				}
			}
			if (secondClub === 16) {
				let firstTeamWin = setGoalsFirstTeam(Math.floor(goalsTeamSecond / 100))
				let secondTeamWin = setGoalsSecondTeam(Math.floor(goalsTeamFirst / 100))
				setClubOpponent(firstClub)
				if (firstTeamWin < secondTeamWin) {
					totatorTournament[round - 1] = true
					setResultsGames(totatorTournament)
					makeResultTable(totatorTournament)
				} else {
					totatorTournament[round - 1] = false
					setResultsGames(totatorTournament)
					makeResultTable(totatorTournament)
				}
			}
			setTimeout(() => {
				if (goalsTeamFirst >= goalsTeamSecond) {
					setTimeout(() => {
						firstWinnerTeam(firstClub)
					}, 2200)
					secondWinnerTeam(secondClub)
					console.log('x1xx')
				} else {
					setTimeout(() => {
						firstWinnerTeam(secondClub)
					}, 2200)
					secondWinnerTeam(firstClub)
					console.log('x2xx')
				}
			}, 2500 * i)
		}
	}

	async function firstWinnerTeam(firstClub) {
		await fetch('/teams/' + firstClub, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...infoClub[firstClub - 1],
				game: infoClub[firstClub - 1].game + 1,
				victory: infoClub[firstClub - 1].victory + 1,
				glasses: infoClub[firstClub - 1].glasses + 3,
			}),
		})
	}
	async function secondWinnerTeam(secondClub) {
		await fetch('/teams/' + secondClub, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...infoClub[secondClub - 1],
				game: infoClub[secondClub - 1].game + 1,
				defeat: infoClub[secondClub - 1].defeat + 1,
				glasses: infoClub[secondClub - 1].glasses + 1,
			}),
		})
	}

	function nextRound() {
		// transition to the next round
		fetch('/round', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				round: round + 1,
			}),
		})
	}
	function makeResultTable(props) {
		fetch('/gameChampionship', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...props,
			}),
		})
	}
	return (
		<>
			<HeaderMenu nav={props.nav} />
			<div className={s.game}>
				<div className={s.game__conteiner}>
					{isLoading ? (
						<Loader />
					) : (
						<TabloMatches
							goalsFirstTeam={goalsFirstTeam}
							goalsSecondTeam={goalsSecondTeam}
							yourTeam={yourTeam}
							clubOpponent={clubOpponent}
							infoClub={infoClub}
						/>
					)}
					<Button
						className={s.game__button}
						onClick={сhampionshipGames}
						type="primary"
					>
						Game
					</Button>
				</div>
				<div className={s.clublist__conteiner}>
					<div className={s.game__clubtable}>
						<h1>Match schedule</h1>
						<ClubTable />
					</div>
				</div>
			</div>
		</>
	)
}

export default Game
