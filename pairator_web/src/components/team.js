import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getTeamData } from '../actions/index';

export class Team extends Component {
  componentWillMount(){
    this.props.getTeamData(this.props.params.teamId);
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

const mapStateToProps = (state, ownProps)=>{
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    getTeamData: (teamId)=>dispatch(getTeamData(teamId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Team);
