import React, { Component } from 'react';
import { getTeamData } from '../actions/index';

export default class EditStations extends Component {
  constructor(props){
    super(props);
    this.state = {teams:[]};
  }

  componentWillMount(){
    getTeamData(this.props.params.teamId);
  }

  render() {
    return (
      <h1>Edit Stations!!!</h1>
    );
  }
}
