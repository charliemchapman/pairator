import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTeam, getUser, getStation } from '../pairatorApi';
import { setTeam, addUser, addStation } from '../actions/index';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

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

  getChart(userId, users, pairHistory, index){
    if (!users[userId]){
      return null;
    }

    const mainUserName = users[userId] ? users[userId].name : '';
    const columns = { alone: 0 };
    Object.keys(users).forEach(u=>{
      if (users[u].name){
        columns[users[u].name] = 0
      }
    });

    pairHistory.forEach(history=>{
      history.pairs.forEach(pair=>{
        if (pair.users.includes(userId)){
          pair.users.forEach(user=>{
            const userName = users[user] ? users[user].name : '';
            if (userName && user !== userId){
            if (!columns[userName]) {columns[userName] = 0}
              columns[userName] += 1;
            }
          })
          if (pair.users.length === 1){
            columns.alone += 1;
          }
        }
      })
    })

    if (Object.keys(columns).filter(x=>x==='') > 0){
      return null;
    }

    const chartData = {
      columns: [],
      type: 'pie',
      color: {
        pattern: ['#d62728', '#2ca02c', '#9467bd', '#1f77b4', '#8c564b', '#ff7f0e']
      }
    }
    Object.keys(columns).forEach(c=>chartData.columns.push([c, columns[c]]));

    return (
      <div className="userPieChart" key={index}>
        <h2>{mainUserName}</h2>
        <C3Chart data={chartData} />
      </div>
    );
  }


  render() {
    let charts;
    charts = Object.keys(this.props.users).filter(x=>x!=='027be6f0-7eeb-4a95-9e1c-c57afa259857').map((user,i)=>{
      return this.getChart(user, this.props.users, this.props.team.pairHistory, i)
    })

    return (
      <div>
        <div className="graph">
          {charts}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps)=>{
  return {
    team: state.team,
    stations: state.stations,
    users: state.users,
    bench: state.bench
  }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    setTeam: (team)=>dispatch(setTeam(team)),
    addStation: (station)=>dispatch(addStation(station)),
    addUser: (user)=>dispatch(addUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphs);
