import React from 'react';
import $ from 'jquery';
import 'datatables.net';

import './GuildRoster.scss';

class GuildRoster extends React.Component {
  state = {
    guildRoster: [],
    formattedRoster: [],
  }

  buildColumns = () => {
    const columns = [{ data: 'name' }, { data: 'lastUpdated' }];
    const teamIds = [...this.props.approvedTeamOrder];
    teamIds.map((teamId) => columns.push({ data: teamId }));
    return columns;
  }

  componentDidMount() {
    const formattedRoster = this.formatGuildRoster();
    this.setState({
      guildRoster: this.props.guildRoster,
      formattedRoster,
    });
  }

  formatGuildRoster = () => {
    const guildRoster = [...this.props.guildRoster];
    const newRoster = guildRoster.map((guildMember) => {
      const teamIds = [...this.props.approvedTeamOrder];
      const memberData = {};
      memberData.name = guildMember.playerName;
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      memberData.lastUpdated = new Date(guildMember.lastUpdated * 1000).toLocaleString('en-US', options);
      // memberData.lastUpdated = new Date(guildMember.lastUpdated * 1000);
      teamIds.forEach((teamId) => {
        memberData[teamId] = '';
      });
      guildMember.playerRoster.forEach((team) => {
        memberData[team.id] = team.teamPower;
      });
      return memberData;
    });
    return newRoster;
  }

  printGuildTable = () => {
    const tables = this.buildColumns();
    $(this.refs.guildTable).DataTable({
      autoWidth: true,
      columns: tables,
      data: this.state.formattedRoster,
      destroy: true,
      // fixedColumns: {
      //   leftColumns: 1,
      // },
      pageLength: 50,
      // scrollCollapse: false,
      scrollX: true,
    });
  }

  render() {
    let printHeaders = [];
    if (this.refs.guildTable) {
      printHeaders = this.props.approvedTeamOrder.map((team) => <th key={team}>{team}</th>);
      const nameHeader = <th key="Name">Name</th>;
      const dateHeader = <th key="LastUpdated">LastUpdated</th>;
      printHeaders.unshift(dateHeader);
      printHeaders.unshift(nameHeader);
      this.printGuildTable();
    }

    return (
      <>
        <table ref="guildTable" className="display compact">
          <thead>
            <tr>
              {printHeaders}
            </tr>
          </thead>
        </table>
      </>
    );
  }
}

export default GuildRoster;
