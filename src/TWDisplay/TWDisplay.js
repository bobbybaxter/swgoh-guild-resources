import React from 'react';

import './TWDisplay.scss';

class TWDisplay extends React.Component {
  state = {
  }

  buildTeams = (player) => {
    // definitions
    const approvedTeams = [...this.props.approvedTeams];
    const newRoster = [];
    const playerToons = Object.values(player)
      .map((p) => p)[0]
      .map((n) => n.data.name);

    // loops through approved teams
    approvedTeams.forEach((at) => {
      const team = at[0];
      console.error(team);
      const toonsNeeded = this.selectRequiredToons(team);
      const comparedToons = [];

      // if the player has the required toons,
      // that toon is removed from their array and
      // added into the corresponding squad in the newRoster
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

      // fill in the rest of the squad members for
      // teams that have required toons
      if (comparedToons.length > 0) {
        comparedToons.forEach((squad) => {
          // if the squad isn't full, add an applicable character
          if (comparedToons.length < 5) {
            const toonToAdd = this.selectToonToAdd();
            comparedToons.push(toonToAdd);
          }
        });
        newRoster.push(comparedToons);
      }
    });

    console.error(newRoster);
    return newRoster;
  }

  getTeamComps = () => {
    const rawPlayerData = [...this.props.rawPlayerData];
    console.error(rawPlayerData[0]);
    this.buildTeams(rawPlayerData[0]);
  }

  selectRequiredToons = (team) => {
    const requiredToons = [];
    if (team.leaderReq === true) { requiredToons.push(team.leaderName); }
    if (team.toon2Req === true) { requiredToons.push(team.toon2Name); }
    if (team.toon3Req === true) { requiredToons.push(team.toon3Name); }
    if (team.toon4Req === true) { requiredToons.push(team.toon4Name); }
    if (team.toon5Req === true) { requiredToons.push(team.toon5Name); }
    return requiredToons;
  };

  selectToonToAdd = () => {

  };

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
