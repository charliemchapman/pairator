import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import deepEqual from 'deep-equal';
import HTML5Backend from 'react-dnd-html5-backend';
import Pair from './pair';
import Bench from './bench';
import { getTeam, putTeam, getUser, getStation } from '../pairatorApi';

export const ItemTypes = {
  USER: 'user'
};

class PairList extends Component {
  constructor(props){
    super(props);

    this.state = {
      users: {},
      stations: {},
      pairs:[],
      benchUsers: [],
      team: {
        pairs: []
      }
    }
  }

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

      this.setState({
        ...this.state,
        users: users,
        stations: stations,
        team: response.Item
      });

      Object.keys(users).forEach(userId=>{
        getUser(userId).then(userResponse=>{
          const newState = {...this.state, users: {...this.state.users}};
          newState.users[userId] = userResponse.Item;

          if (!newState.users[userId].active){
            newState.team = {...this.state.team, pairs: [...this.state.team.pairs]}
            newState.team.pairs.forEach(pair=>{
              const newUsers = [];
              pair.users.forEach(oldUserId=>{
                if (oldUserId !== userId){
                  newUsers.push(oldUserId);
                }
              });
              pair.users = newUsers;
            });
          }

          this.setState(newState);
        })
      })

      Object.keys(stations).forEach(stationId=>{
        getStation(stationId).then(stationResponse=>{
          const newState = {...this.state, stations: {...this.state.stations}};
          newState.stations[stationId] = stationResponse.Item;
          this.setState(newState);
        })
      })
    })
  }

  lockInPairs(state){
    const currentHistory = state.team.pairHistory || [];
    const newState = {...state, team: {...state.team, pairHistory:[...currentHistory]}}
    newState.team.pairHistory.push(
      {
        id: newState.team.pairHistory.length,
        timeStamp:Date.now(),
        pairs:newState.team.pairs
      }
    )
    putTeam(newState.team);
    this.setState(newState);
  }

  shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
  }

  toggleUserLock(userId){
    const newState = {...this.state, users: {...this.state.users}}
    newState.users[userId] = {...this.state.users[userId], locked:!this.state.users[userId].locked};
    this.setState(newState)
  }

  moveUser(userId, stationId){
    const newPairs = this.state.team.pairs.map(x=>{return {...x}})
    const newState = {...this.state, team: {...this.state.team, pairs: newPairs}};

    this.removeUserFromAllLists(userId, newState);

    const addToPair = newState.team.pairs.find(p=>p.stationId===stationId);
    addToPair.users = [...addToPair.users, userId];

    //unlock user
    newState.users[userId].locked = false;

    this.setState(newState);
  }

  benchUser(userId){
    console.log(this.state);
    const newState = {...this.state, team: { ...this.state.team, benchUserIds: [...this.state.team.benchUserIds, userId]} };
    this.removeUserFromAllLists(userId, newState)
    this.setState(newState);
  }

  removeUserFromAllLists(userId, newState){
    const removeFromPair = newState.team.pairs.find(p=>p.users.find(x=>x===userId));
    if (removeFromPair){
      removeFromPair.users = removeFromPair.users.filter(x=>x !== userId);
    } else {
      newState.team.benchUserIds = newState.team.benchUserIds.filter(x=>x !== userId)
    }
  }

  pairate(){
    let newPairs = [];
    let movingUsers = [];
    let shuffledPairs = this.shuffle([...this.state.team.pairs])
    shuffledPairs.forEach(oldPair=>{
      let newPair = {stationId:oldPair.stationId, users:[]}
      oldPair.users.forEach(user=>{
        if (this.state.users[user].locked){
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

    const newState = {...this.state, team:{ ...this.state.team, pairs:newPairs} };
    this.setState(newState);
  }

  isDirty(){
    const team = this.state.team || {};
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

  render() {
    const {team = {}, users = {}, stations = {}} = this.state;
    const {pairs=[], benchUserIds=[], pairHistory=[]} = team;

    const pairate = ()=>this.pairate();
    const toggleLock = userId=>this.toggleUserLock(userId);
    const lockInPairs = ()=> this.lockInPairs(this.state);
    const resetFromApi = ()=> this.fetchTeam();

    const sortedPairs = this.sortPairs(pairs, stations);
    const dirty = this.isDirty();

    const pairDivs = sortedPairs.map((p,index)=>{
      return (<Pair
        pair={p}
        users={users}
        stations={stations}
        toggleLock={toggleLock}
        moveUser={this.moveUser.bind(this)}
        pairHistory={pairHistory}
        key={index}/>);
    })

    const bench = (<Bench
          benchUsers={benchUserIds}
          users={users}
          benchUser={this.benchUser.bind(this)}/>);

    return (
      <div>
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

export default DragDropContext(HTML5Backend)(PairList);
