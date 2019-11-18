import React from 'react';

import './PlayerRoster.scss';

class PlayerRoster extends React.Component {
  render() {
    const { playerName, playerRoster } = this.props;
    const printPlayerRoster = playerRoster.map((teamRow) => {
      const uniqueId = `${teamRow.id}-${teamRow.teamPower}`;
      return (<tr key={uniqueId}>
        <td>{teamRow.id}</td>
        <td>{teamRow.teamPower}</td>
        <td>{teamRow.leader.name}</td>
        <td>{teamRow.toon2.name}</td>
        <td>{teamRow.toon3.name}</td>
        <td>{teamRow.toon4.name}</td>
        <td>{teamRow.toon5.name}</td>
      </tr>);
    });
    return (
      <>
        <div className="playerHeader mt-3">
          <h2>{playerName}</h2>
        </div>
        <table className="minimalistBlack mb-3">
          <thead>
            <tr>
              <th>Team Id</th>
              <th>Power</th>
              <th>Leader</th>
              <th>Toon 2</th>
              <th>Toon 3</th>
              <th>Toon 4</th>
              <th>Toon 5</th>
            </tr>
          </thead>
          <tbody>
            {printPlayerRoster}
          </tbody>
        </table>
      </>
    );
  }
}

export default PlayerRoster;
