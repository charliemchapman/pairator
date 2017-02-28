import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import deepEqual from 'deep-equal';
import HTML5Backend from 'react-dnd-html5-backend';
import Pair from './pair';
import Bench from './bench';
import { setTeam, addStation, addUser, toggleLock, setLock } from '../actions/index';
import { getTeam, putTeam, getUser, getStation } from '../pairatorApi';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

export const ItemTypes = {
  USER: 'user'
};

class PairList extends Component {
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

  lockInPairs(state){
    const currentHistory = this.props.team.pairHistory || [];
    const newTeam = {...this.props.team, pairHistory:[...currentHistory]};
    newTeam.pairHistory.push(
      {
        id: newTeam.pairHistory.length,
        timeStamp:Date.now(),
        pairs:newTeam.pairs
      }
    )
    putTeam(newTeam);
    this.props.setTeam(newTeam);
  }

  shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
  }

  moveUser(userId, stationId){
    const newPairs = this.props.team.pairs.map(x=>{return {...x}})
    const newTeam = {...this.props.team, pairs: newPairs};

    this.removeUserFromAllLists(userId, newTeam);

    const addToPair = newTeam.pairs.find(p=>p.stationId===stationId);
    addToPair.users = [...addToPair.users, userId];

    //unlock user
    this.props.setLock(userId, false);

    this.props.setTeam(newTeam);
  }

  benchUser(userId){
    const newTeam = { ...this.props.team, benchUserIds: [...this.props.team.benchUserIds, userId]};
    this.removeUserFromAllLists(userId, newTeam)

    this.props.setTeam(newTeam);
  }

  removeUserFromAllLists(userId, newTeam){
    const removeFromPair = newTeam.pairs.find(p=>p.users.find(x=>x===userId));
    if (removeFromPair){
      removeFromPair.users = removeFromPair.users.filter(x=>x !== userId);
    } else {
      newTeam.benchUserIds = newTeam.benchUserIds.filter(x=>x !== userId)
    }
  }

  pairate(){
    let newPairs = [];
    let movingUsers = [];
    let shuffledPairs = this.shuffle([...this.props.team.pairs])
    shuffledPairs.forEach(oldPair=>{
      let newPair = {stationId:oldPair.stationId, users:[]}
      oldPair.users.forEach(user=>{
        if (this.props.users[user].locked){
          newPair.users.push(user);
        }
        else{
          movingUsers.push(user);
        }
      })
      newPairs.push(newPair);
    })

    let shuffledUsers = this.shuffle(movingUsers);

    newPairs.forEach(newPair=>{
      while(newPair.users.length < 2 && shuffledUsers.length > 0){
        newPair.users.push(shuffledUsers[0]);
        shuffledUsers.splice(0,1);
      }
    })

    const newTeam = { ...this.props.team, pairs:newPairs }
    this.props.setTeam(newTeam);
  }

  isDirty(){
    const team = this.props.team || {};
    const { pairs=[], pairHistory=[]} = team;
    if (pairHistory.length < 1) return true;

    const lastHistory = [...pairHistory].sort((a,b)=>{return b.id-a.id;})[0];

    return !deepEqual(pairs, lastHistory.pairs);
  }

  sortPairs(pairs, stations){
    return pairs.sort((a,b)=>{
      if (!stations[a.stationId] || !stations[b.stationId]){return 0;}
      return stations[a.stationId].order-stations[b.stationId].order
    });
  }

  getChart(userId, users, pairHistory){
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
            const userName = users[user].name;
            if (userName && user != userId){
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

    const chartData = {
      columns: [],
      type: 'pie',
      color: {
        pattern: ['#d62728', '#2ca02c', '#9467bd', '#1f77b4', '#8c564b', '#ff7f0e']
      }
    }
    Object.keys(columns).forEach(c=>chartData.columns.push([c, columns[c]]));

    return (
      <div className="userPieChart">
        <h2>{mainUserName}</h2>
        <C3Chart data={chartData} />
      </div>
    );
  }

  render() {

    const { team = {}, users = {}, stations = {} } = this.props;
    const {pairs=[], benchUserIds=[], pairHistory=[]} = team;

    const pairate = ()=>this.pairate();
    const lockInPairs = ()=> this.lockInPairs(this.state);
    const resetFromApi = ()=> this.fetchTeam();

    const sortedPairs = this.sortPairs(pairs, stations);
    const dirty = this.isDirty();

    const pairDivs = sortedPairs.map((p,index)=>{
      return (<Pair
        pair={p}
        users={users}
        stations={stations}
        toggleLock={this.props.toggleLock}
        moveUser={this.moveUser.bind(this)}
        pairHistory={pairHistory}
        key={index}/>);
    })

    const bench = (<Bench
          benchUsers={benchUserIds}
          users={users}
          benchUser={this.benchUser.bind(this)}/>);

    const charts = Object.keys(users).filter(x=>x!='027be6f0-7eeb-4a95-9e1c-c57afa259857').map(user=>{
      return this.getChart(user, users, pairHistory);
    })

    return (
      <div>
        <div className='graph'>
          {charts}
        </div>
        <button className='pairate-button blue-button' onClick={pairate}>Suggest a Switch!</button>
        <button className='save-button blue-button' onClick={lockInPairs} disabled={!dirty}>Lock in</button>
        <button className='reset-button blue-button' onClick={resetFromApi} disabled={!dirty}>Reset</button>
        <div className='main'>
          <div className='gutter'/>
          <div className='pair-list'>
            {pairDivs}
            {bench}
          </div>
          <div className='gutter'/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  return { team: state.team, stations: state.stations, users: state.users, bench: state.bench }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    setTeam: (team)=>dispatch(setTeam(team)),
    addStation: (station)=>dispatch(addStation(station)),
    addUser: (user)=>dispatch(addUser(user)),
    toggleLock: (userId)=>dispatch(toggleLock(userId)),
    setLock: (userId, lock)=>dispatch(setLock(userId, lock))
  }
}

const connectedPairList = connect(
  mapStateToProps, mapDispatchToProps
)(PairList);

export default DragDropContext(HTML5Backend)(connectedPairList);
