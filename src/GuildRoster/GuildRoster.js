import React from 'react';
import $ from 'jquery';
import 'datatables.net';

import './GuildRoster.scss';

class GuildRoster extends React.Component {
  state = {
    guildRoster: [],
  }

  componentDidMount() {
    this.setState({ guildRoster: this.props.guildRoster });
  }

  printGuildTable = () => {
    $(this.refs.guildTable).DataTable({
      autoWidth: true,
      columns: [
        { data: 'id' },
      ],
      data: this.state.guildRoster,
      scrollCollapse: true,
      scrollX: true,
    });
  }

  render() {
    let printHeaders = [];
    if (this.refs.guildRoster) {
      printHeaders = this.props.approvedTeamOrder.map((team) => <th key={team}>{team}</th>);
      this.printGuildTable();
    }

    return (
      <>
        <h2>Guild Roster</h2>
        <table ref="guildTable" className="display compact nowrap">
          <thead>
            <tr>
              <th>{this.refs.guildRoster ? 'Member' : ''}</th>
              {printHeaders}
            </tr>
          </thead>
        </table>
      </>
    );
  }
}

export default GuildRoster;
