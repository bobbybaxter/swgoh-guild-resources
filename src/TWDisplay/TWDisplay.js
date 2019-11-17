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
    const approvedTeamList = [...this.props.approvedTeams].map((team) => team[0]);
    const newRoster = [];
    const playerToons = Object.values(player)
      .map((p) => p)[0]
      .filter((c) => c.data.combat_type === 1)
      .map((n) => n.data.name);
    const toonsWithPower = Object.values(player)
      .map((p) => p)[0]
      .map((n) => ({ name: n.data.name, power: n.data.power }));

    while (approvedTeamList.length) {
      // find the highest power teams regardless of duplicates, and sort them by teamPower
      const bestOverallTeams = this.findBestOverallTeams(
        approvedTeamList,
        playerToons,
        toonsWithPower,
      );
      bestOverallTeams.sort((a, b) => ((a.teamPower < b.teamPower) ? 1 : -1));

      if (bestOverallTeams[0].teamPower > 0) {
        // find the best toons for the highest powered team not yet selected
        const topBestTeam = this.findTopBestTeam(
          approvedTeamList,
          playerToons,
          toonsWithPower,
          bestOverallTeams[0].id,
        );
        // push the topBestTeam to the newRoster,
        // remove from approvedTeamList,
        // loop until there are no more approvedTeams available
        newRoster.push(topBestTeam);
        const index = approvedTeamList.findIndex((x) => (
          topBestTeam ? x.id === topBestTeam.id : -1
        ));
        approvedTeamList.splice(index, 1);
      } else {
        const topBestTeam = this.findTopBestTeam(bestOverallTeams, playerToons);
        const index = approvedTeamList.findIndex((x) => (
          topBestTeam ? x.id === topBestTeam.id : -1
        ));
        approvedTeamList.splice(index, 1);
      }
    }

    return newRoster;
  }

  findBestOverallTeams = (approvedTeamList, playerToons, toonsWithPower) => {
    const bestOverallTeams = [];

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
            tempSquad.push({
              name: matchedToonWithPower.name,
              power: matchedToonWithPower.power,
            });
          }
        });
      }

      if (tempSquad.length === toonsNeeded.length) {
        // fill in the rest of the squad members for
        // teams that have required toons
        if (tempSquad.length > 0) {
          if (tempSquad.length < 5) {
            const emptySlots = 5 - tempSquad.length;
            for (let i = 0; i < emptySlots; i += 1) {
              const toonToAdd = this.selectToonToAdd(
                toonsWithPower,
                playerToons,
                team.id,
                tempSquad,
              );
              if (toonToAdd) {
                tempSquad.push(toonToAdd);
              }
            }
          }
          // if the squad is incomplete, put the toons back in the pool
          if (tempSquad.length < 5) {
            tempSquad = {
              id: team.id,
              teamPower: 0,
            };
            bestOverallTeams.push(tempSquad);
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
            bestOverallTeams.push(tempSquad);
          }
        }
      } else if (tempSquad.length < toonsNeeded.length) {
        tempSquad = {
          id: team.id,
          teamPower: 0,
        };
        bestOverallTeams.push(tempSquad);
      }
    });
    return bestOverallTeams;
  }

  findTopBestTeam = (approvedTeamList, playerToons, toonsWithPower, bestOverallTeamId) => {
    const topBestTeam = [];
    let toonsNeeded = [];
    let tempSquad = [];
    const matchedTeam = approvedTeamList.filter((at) => at.id === bestOverallTeamId)[0];
    if (matchedTeam) {
      toonsNeeded = this.selectRequiredToons(matchedTeam);
    }

    if (playerToons) {
      toonsNeeded.forEach((toonNeeded) => {
        const matchedToon = playerToons.filter((pt) => pt === toonNeeded);
        if (matchedToon[0]) {
          const matchedToonWithPower = toonsWithPower
            .find((toon) => matchedToon[0] === toon.name);
          const index = playerToons.indexOf(matchedToon[0]);
          tempSquad.push({
            name: matchedToonWithPower.name,
            power: matchedToonWithPower.power,
          });
          playerToons.splice(index, 1);
        }
      });
    }

    if (tempSquad.length > 0) {
      if (tempSquad.length < 5) {
        const emptySlots = 5 - tempSquad.length;
        for (let i = 0; i < emptySlots; i += 1) {
          const toonToAdd = this.selectToonToAdd(
            toonsWithPower,
            playerToons,
            bestOverallTeamId,
            tempSquad,
          );
          if (toonToAdd) {
            const matchedToon = playerToons.filter((pt) => pt === toonToAdd.name);
            const index = playerToons.indexOf(matchedToon[0]);
            tempSquad.push(toonToAdd);
            playerToons.splice(index, 1);
          }
        }
      }

      if (tempSquad.length < 5) {
        tempSquad.forEach((squadMember) => {
          playerToons.push(squadMember.name);
        });
        tempSquad = {
          id: bestOverallTeamId,
          teamPower: 0,
        };
        topBestTeam.push(tempSquad);
      } else {
        const teamPower = tempSquad
          .map((a) => a.power)
          .reduce((b, c) => b + c);
        tempSquad = {
          leader: tempSquad[0],
          toon2: tempSquad[1],
          toon3: tempSquad[2],
          toon4: tempSquad[3],
          toon5: tempSquad[4],
          teamPower,
          id: bestOverallTeamId,
        };
        topBestTeam.push(tempSquad);
      }
    }
    return topBestTeam[0];
  };

  getTeamComps = () => {
    const rawPlayerData = [...this.props.rawPlayerData];
    // USED FOR MULTIPLAYER
    // const guildRoster = this.buildGuildRoster(rawPlayerData);
    // this.setState({ guildRoster });
    const playerRoster = this.buildPlayerTeams(rawPlayerData[7]);
    console.error('playerRoster', playerRoster);
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

  selectToonToAdd = (toonsWithPower, playerToons, teamId, tempSquad) => {
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
    const duplicate = subsWithPower.filter((sub) => tempSquad.indexOf(sub) !== -1);
    // sorts the subs by the highest power
    // then returns an array of the names of those subs
    subsWithPower.sort((a, b) => ((a.power < b.power) ? 1 : -1));
    // const sortedSubs = Object.values(subsWithPower)
    //   .map((s) => s)
    //   .map((p) => p.name);
    // return sortedSubs[0];
    if (duplicate.length > 0) {
      return subsWithPower[1];
    }
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
          {this.props.approvedTeams.length > 0 ? <button className="btn btn-primary" onClick={this.getTeamComps}>Get Team Comps</button> : ''}
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
