import s from './Game.module.css'

function TabloMatches(props) {
	return (
		<>
			<div className={s.game__tablo}>
				<div className={s.game__command}>
					<img
						src={props.yourTeam.logotype}
						alt={props.yourTeam.id}
						width="200"
						height="200"
					/>
					<p>FC {props.yourTeam.clubName}</p>
				</div>
				<div className={s.game__check}>
					<h2>Match Championship</h2>
					<p>
						<span>{props.goalsFirstTeam}</span>
						<span>-</span>
						<span>{props.goalsSecondTeam}</span>
					</p>
				</div>
				<div className={s.game__command}>
					<img
						src={props.infoClub[props.clubOpponent].logotype}
						alt={props.infoClub[props.clubOpponent].id}
						width="200"
						height="200"
					/>
					<p>FC {props.infoClub[props.clubOpponent].clubName}</p>
				</div>
			</div>
		</>
	)
}

export default TabloMatches
