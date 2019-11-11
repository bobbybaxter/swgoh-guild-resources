import React from 'react';

import roster from './GuildRoster.json';

import './Main.scss';

class Main extends React.Component {
  state = {
    guildData: [],
    rawPlayerData: [],
  }

  componentDidMount() {
    this.setState({ guildData: roster.data, rawPlayerData: roster.players });
  }

  render() {
    const { guildData } = this.state;

    return (
      <>
        <div className="main-header">
          <h1>{guildData.name}</h1>
          <div className="container d-flex flex-row justify-content-around">
            <p>Members: {guildData.member_count}</p>
            <p>Galactic Power: {guildData.galactic_power ? guildData.galactic_power.toLocaleString() : ''}</p>
          </div>
        </div>
      </>
    );
  }
}

export default Main;
