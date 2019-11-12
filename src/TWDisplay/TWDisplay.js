import React from 'react';

import './TWDisplay.scss';

class TWDisplay extends React.Component {
  state = {
  }

  getTeamComps = () => {
    const rawPlayerData = [...this.props.rawPlayerData];
    console.error(rawPlayerData[0]);
    this.validateTeams(rawPlayerData[0]);
  }

  validateTeams = (player) => {
    const approvedTeams = [...this.props.approvedTeams];
    const newRoster = [];
    const playerToons = Object.values(player)
      .map((p) => p)[0]
      .map((n) => n.data.name);

    approvedTeams.forEach((at) => {
      const team = at[0];
      const toonsNeeded = [];
      const comparedToons = [];
      if (team.leaderReq === true) { toonsNeeded.push(team.leaderName); }
      if (team.toon2Req === true) { toonsNeeded.push(team.toon2Name); }
      if (team.toon3Req === true) { toonsNeeded.push(team.toon3Name); }
      if (team.toon4Req === true) { toonsNeeded.push(team.toon4Name); }
      if (team.toon5Req === true) { toonsNeeded.push(team.toon5Name); }

      if (playerToons) {
        toonsNeeded.forEach((toonNeeded) => {
          const matchedToon = playerToons.filter((pt) => pt === toonNeeded);
          if (matchedToon[0]) {
            const index = playerToons.indexOf(matchedToon[0]);
            comparedToons.push(matchedToon[0]);
            playerToons.splice(index, 1);
          }
        });
      }

      if (comparedToons.length > 0) {
        newRoster.push(comparedToons);
      }
    });

    console.error(newRoster);
    return newRoster;
  }


  render() {
    return (
      <>
        <div className="twDisplay-header">
          <h2>TW Display</h2>
          <button className="btn btn-primary" onClick={this.getTeamComps}>Get Team Comps</button>
        </div>
      </>
    );
  }
}

export default TWDisplay;
