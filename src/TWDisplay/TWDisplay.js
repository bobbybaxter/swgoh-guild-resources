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

    approvedTeams.forEach((at) => {
      const team = at[0];
      const toonsNeeded = [];
      const comparedToons = [];
      if (team.leaderReq === true) { toonsNeeded.push(team.leaderName); }
      if (team.toon2Req === true) { toonsNeeded.push(team.toon2Name); }
      if (team.toon3Req === true) { toonsNeeded.push(team.toon3Name); }
      if (team.toon4Req === true) { toonsNeeded.push(team.toon4Name); }
      if (team.toon5Req === true) { toonsNeeded.push(team.toon5Name); }

      player.units.forEach((t) => {
        const toon = t.data;
        const neededToon = toonsNeeded.filter((tn) => tn === toon.name);
        // something wrong with comparing toons inside the newRoster.forEach loop
        if (neededToon.length > 0) {
          // newRoster.forEach((squad) => {
          //   if (!squad.includes(neededToon[0])) {
          //     comparedToons.push(neededToon[0]);
          //   }
          // });
          newRoster.forEach((squad) => {
            if (!squad.includes(neededToon[0])) {
              comparedToons.push(neededToon[0]);
            }
          });
          // console.error('comparedToons', comparedToons);
        }
      });

      if (comparedToons.length > 0) {
        newRoster.push(comparedToons);
      }
    });

    console.error('newRoster', newRoster);

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
