import React from 'react';

import './TWDisplay.scss';

import subsData from './Subs.json';

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
    const toonsWithPower = Object.values(player)
      .map((p) => p)[0]
      .map((n) => ({ name: n.data.name, power: n.data.power }));

    // loops through approved teams
    approvedTeams.forEach((at) => {
      const team = at[0];
      const toonsNeeded = this.selectRequiredToons(team);
      const tempSquad = [];

      // if the player has the required toons,
      // that toon is removed from their array and
      // added into the corresponding squad in the newRoster
      if (playerToons) {
        toonsNeeded.forEach((toonNeeded) => {
          const matchedToon = playerToons.filter((pt) => pt === toonNeeded);
          if (matchedToon[0]) {
            const index = playerToons.indexOf(matchedToon[0]);
            tempSquad.push(matchedToon[0]);
            playerToons.splice(index, 1);
          }
        });
      }

      // fill in the rest of the squad members for
      // teams that have required toons
      if (tempSquad.length > 0) {
        if (tempSquad.length < 5) {
          const emptySlots = 5 - tempSquad.length;
          for (let i = 0; i < emptySlots; i += 1) {
            const toonToAdd = this.selectToonToAdd(toonsWithPower, playerToons, team.id);
            const matchedToon = playerToons.filter((pt) => pt === toonToAdd);
            if (toonToAdd) {
              const index = playerToons.indexOf(matchedToon[0]);
              tempSquad.push(toonToAdd);
              playerToons.splice(index, 1);
            }
          }
        }
        // if the squad is incomplete, put the toons back in the pool
        if (tempSquad.length < 5) {
          tempSquad.forEach((squadMember) => {
            playerToons.push(squadMember);
          });
        } else {
          newRoster.push(tempSquad);
        }
      }
    });
    return newRoster;
  }

  getTeamComps = () => {
    const rawPlayerData = [...this.props.rawPlayerData];
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

  selectToonToAdd = (toonsWithPower, playerToons, teamId) => {
    const subsWithPower = [];
    const filteredToonsWithPower = toonsWithPower
      .filter((toon) => playerToons.indexOf(toon.name) !== -1);
    // fills in subsWithPower by finding the subs in that team and
    // returns the toonsWithPower objects of those toons
    subsData
      .filter((sub) => sub.id === teamId)[0]
      .subs
      .split(', ')
      .forEach((sub) => {
        const matchedToonWithPower = filteredToonsWithPower.filter((twp) => twp.name === sub)[0];
        if (matchedToonWithPower) {
          subsWithPower.push(matchedToonWithPower);
        }
      });
    // sorts the subs by the highest power
    // then returns an array of the names of those subs
    subsWithPower.sort((a, b) => ((a.power < b.power) ? 1 : -1));
    const sortedSubs = Object.values(subsWithPower)
      .map((s) => s)
      .map((p) => p.name);
    return sortedSubs[0];
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
