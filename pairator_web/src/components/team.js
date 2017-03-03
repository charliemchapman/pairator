import React, { Component } from 'react';
import { Link } from 'react-router';
import { getTeamData } from '../actions/index';

export default class Team extends Component {
  constructor(props){
    super(props);
    this.state = {teams:[]};
  }

  componentWillMount(){
    getTeamData(this.props.params.teamId);
  }

  render() {
    return (
      <div>
        <div className="team-header">
          <Link to={`/pairator/teams/${this.props.params.teamId}`}>Home</Link>
          <Link to={`/pairator/teams/${this.props.params.teamId}/stations`}>Stations</Link>
          <Link to={`/pairator/teams/${this.props.params.teamId}/users`}>Users</Link>
          <Link to={`/pairator/teams/${this.props.params.teamId}/graphs`}>Graphs</Link>
        </div>
        {this.props.children}
      </div>
    );
  }
}
