import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTeam, getUser, getStation } from '../pairatorApi';
import { setTeam } from '../actions/index';

class Graphs extends Component {
  componentWillMount(){
    this.fetchTeam();
  }

  fetchTeam(){
    getTeam(this.props.params.teamId).then((response)=>{
      const users = {};
       response.Item.userIds.forEach((userId, i)=>{
        users[userId] = {id: userId}
      });

      const stations = {};
      response.Item.stationIds.forEach((stationId, i)=>{
        stations[stationId] = {id:stationId}
      });

      this.props.setTeam(response.Item);

      Object.keys(users).forEach(userId=>{
        getUser(userId).then(userResponse=>{
          this.props.addUser(userResponse.Item)
        })
      })

      Object.keys(stations).forEach(stationId=>{
        getStation(stationId).then(stationResponse=>{
          this.props.addStation(stationResponse.Item);
        })
      })
    })
  }

  render() {
    return (
      <div>
        <h2>
          { this.props.team.name }
        </h2>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps)=>{
  return { team: state.team, stations: state.stations, users: state.users, bench: state.bench }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    setTeam: (team)=>dispatch(setTeam(team))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphs);
