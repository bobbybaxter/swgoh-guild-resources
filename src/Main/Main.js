import React from 'react';

// FOR TESTING PURPOSES
// import roster from './GuildRoster.json';

import teamsData from '../helpers/data/teamsData';
import GuildData from '../helpers/data/guildData';
import GuildOptions from '../GuildOptions/GuildOptions';
import TWDisplay from '../TWDisplay/TWDisplay';

import './Main.scss';

const approvedTeamOrder = [
  // S-Tier
  '501ST',
  'SITH_EMPIRE_W_MALAK',
  'SITH_EMPIRE_WO_MALAK',
  'JEDI_REVAN',
  // A-Tier
  'SITH_TRI',
  'REBELS_CLS',
  'GALACTIC_REPUBLIC',
  'GEONOSIANS',
  'NS_ASAJJ',
  'NS_MT',
  'NS_MT_NA',
  'SEP_DROIDS',
  'CLONES_SHAAKTI',
  'REX_501',
  // B-Tier
  'JEDI_BASTILA',
  'FO_KRU',
  'BH_BOSSK',
  'BH_JANGO',
  'EP',
  'JTR',
  'EWOKS',
  // C-Tier
  'OR_CARTH',
  'QIRA',
  'IT',
  // D-Tier
  'REBELS_WIGGS',
  'PHOENIX',
  'ROGUE_ONE',
  'IT_THRAWN',
  'JEDI_QGJ',
  'REX_WAMPA',
  'WAMPA_SOLO',
  // E-Tier
  'JAWAS',
  'CLONES_CODY',
  // 'EP_ANTI_REBEL',
  // 'EP_ANTI-TRAYA',
  // 'EP_TRIO',
  // 'EP_TRAYA',
  // Rest/Variations
  // 'SION_SOLO',
  'DK_ANTI_REBEL',
  'DROIDS_ANTI_MALAK',
  // 'NEST_SOLO',
  'EWOKS_C3PO',
  // 'GALACTIC_REPUBLIC_C3PO',
  'GK',
  // 'IG-88_HI',
  // 'JEDI_BASTILA_REVAN',
  'MAGMA',
  'NS_NEST',
  'QIRA_NEST_HODA',
  'QIRA_NEST_HODA_FULL',
  // 'REBELS_CLS_THRAWN',
  'REBELS_CLS_CHAZE',
  'REBELS_DANGER_ZONE',
  'JTR_DROIDS',
  'JTR_HOLDO',
  'REX',
  'SEP_NUTE',
  'SITH_MAUL',
  'ZADER',
];

class Main extends React.Component {
  state = {
    approvedTeams: [],
    guildData: [],
    rawPlayerData: [],
  }

  componentDidMount() {
    teamsData.getTeams()
      .then((res) => {
        const orderedTeams = this.orderTeams(res);
        this.setState({ approvedTeams: orderedTeams });
      })
      .catch((err) => console.error(err));
    GuildData.getGuildData()
      .then((res) => this.setState({ guildData: res.data, rawPlayerData: res.players }))
      .catch((err) => console.error(err));
    // FOR TESTING PURPOSES - to not ping swgoh.gg for testing
    // this.setState({ guildData: roster.data, rawPlayerData: roster.players });
  }

  orderTeams = (t) => {
    const unorderedTeams = t;
    const newTeamList = [];
    approvedTeamOrder.forEach((orderedTeam) => {
      const team = unorderedTeams.filter((uot) => uot.id === orderedTeam);
      newTeamList.push(team);
    });
    return newTeamList;
  };

  render() {
    const { approvedTeams, guildData, rawPlayerData } = this.state;

    return (
      <>
        <div className="main-header text-center">
          <h1>{guildData.name}</h1>
          <div className="container d-flex flex-row justify-content-around">
            <p>Members: {guildData.profile_count}</p>
            <p>Galactic Power: {guildData.galactic_power ? guildData.galactic_power.toLocaleString() : ''}</p>
          </div>
        </div>
        <div>
          <GuildOptions />
          <TWDisplay
            approvedTeamOrder = {approvedTeamOrder}
            approvedTeams = {approvedTeams}
            rawPlayerData = {rawPlayerData}
          />
        </div>
      </>
    );
  }
}

export default Main;
