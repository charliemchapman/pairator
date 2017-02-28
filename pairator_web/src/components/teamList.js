import React, { Component } from 'react';
import { Link } from 'react-router';
import { getTeams } from '../pairatorApi';

export default class TeamList extends Component {
  constructor(props){
    super(props);
    this.state = {teams:[]};
  }

  componentWillMount(){
    return getTeams().then((response)=>{
      this.setState({teams:response})
    });
  }

  render() {
    const teamDivs = this.state.teams.map((team, i)=>{
      return (
        <Link to={`/pairator/teams/${team.teamId}`} key={i}>
          <div className="box">
            <div className="header">{team.name}</div>
          </div>
        </Link>
      )
    })

    return (
      <div>{teamDivs}</div>
    );
  }
}
