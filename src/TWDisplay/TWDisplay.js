import React from 'react';

import './TWDisplay.scss';

import GuildRoster from '../GuildRoster/GuildRoster';
import PlayerRoster from '../PlayerRoster/PlayerRoster';

import subsData from './Subs.json';

class TWDisplay extends React.Component {
  state = {
    guildRoster: [],
  };

  buildGuildRoster = (guildMembersData) => {
    const tempRoster = [];
    guildMembersData.forEach((guildMemberData) => {
      const playerName = guildMemberData.data.name;
      const playerRoster = this.buildPlayerTeams(guildMemberData);
      tempRoster.push([{ playerName, playerRoster }]);
    });
    // remap tempRoster from array to object
    return tempRoster;
  }

  buildPlayerTeams = (player) => {
    // definitions
    const approvedTeamList = [...this.props.approvedTeams];
    const newRoster = [];
    const playerToons = Object.values(player)
      .map((p) => p)[0]
      .map((n) => n.data.name);
    const toonsWithPower = Object.values(player)
      .map((p) => p)[0]
      .map((n) => ({ name: n.data.name, power: n.data.power }));

    while (approvedTeamList.length) {
      console.error(approvedTeamList.length);
      const bestOverallTeams = this.findBestOverallTeams(approvedTeamList, playerToons);
      approvedTeamList.shift();
    }

    // loops through approved teams
    approvedTeamList.forEach((approvedTeam) => {
      const team = approvedTeam;
      const toonsNeeded = this.selectRequiredToons(team);
      let tempSquad = [];

      // if the player has the required toons,
      // that toon is removed from their array and
      // added into the corresponding squad in the newRoster
      if (playerToons) {
        toonsNeeded.forEach((toonNeeded) => {
          const matchedToon = playerToons.filter((pt) => pt === toonNeeded);
          if (matchedToon[0]) {
            const matchedToonWithPower = toonsWithPower
              .find((toon) => matchedToon[0] === toon.name);
            const index = playerToons.indexOf(matchedToon[0]);
            // tempSquad.push(matchedToon[0]);
            tempSquad.push({
              name: matchedToonWithPower.name,
              power: matchedToonWithPower.power,
            });
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
          const teamPower = tempSquad
            .map((a) => a.power)
            .reduce((b, c) => b + c);
          // re-maps squad to include key/value pairs
          tempSquad = {
            leader: tempSquad[0],
            toon2: tempSquad[1],
            toon3: tempSquad[2],
            toon4: tempSquad[3],
            toon5: tempSquad[4],
            teamPower,
            id: team.id,
          };
          newRoster.push(tempSquad);
        }
      }
    });
    return newRoster;
  }

  findBestOverallTeams = () => {

  }

  getTeamComps = () => {
    const rawPlayerData = [...this.props.rawPlayerData];
    // USED FOR MULTIPLAYER
    // const guildRoster = this.buildGuildRoster(rawPlayerData);
    // this.setState({ guildRoster });
    const playerRoster = this.buildPlayerTeams(rawPlayerData[0]);
    console.error(playerRoster);
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
    // const sortedSubs = Object.values(subsWithPower)
    //   .map((s) => s)
    //   .map((p) => p.name);
    // return sortedSubs[0];
    return subsWithPower[0];
  };

  render() {
    let printPlayerRosters = [];
    // can't get printplayerrosters to work
    if (this.state.guildRoster.length > 0) {
      printPlayerRosters = this.state.guildRoster.forEach((player) => (<PlayerRoster
        playerName = {player.playerName}
        playerRoster = {player.playerRoster}
      />));
    }
    return (
      <>
        <div className="twDisplay-header">
          <h2>TW Display</h2>
          <button className="btn btn-primary" onClick={this.getTeamComps}>Get Team Comps</button>
          <GuildRoster
            guildRoster = {this.state.guildRoster}
            approvedTeamOrder = {this.props.approvedTeamOrder}
          />
          {printPlayerRosters}
        </div>
      </>
    );
  }
}

export default TWDisplay;
