import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Pair from './pair';
import Bench from './bench';

export const ItemTypes = {
  USER: 'user'
};

const userSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class PairList extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: {
        1: {id: 1, name:'Charlie', locked:false, picture:'charlie'},
        2: {id: 2, name:'Greg', locked:false, picture:'greg'},
        3: {id: 3, name:'Ray', locked:false, picture:'ray'},
        4: {id: 4, name:'Charles', locked:true, picture:'charles'},
        5: {id: 5, name:'Beau', locked:false, picture:'beau'},
        6: {id: 6, name:'Chad', locked:true, picture:'chad'},
        7: {id: 7, name:'Jim', locked:false, picture:'jim'},
        8: {id: 8, name:'Jeremy', locked:true, picture:'jeremy'}
      },
      stations: {
        1: {name:'Dev1'},
        2: {name:'Dev2'},
        3: {name:'Dev3'},
        4: {name:'Dev4'}
      },
      pairs: [
        {id:1, stationId:1, users:[1,2]},
        {id:2, stationId:2, users:[3,4]},
        {id:3, stationId:3, users:[5,6]},
        {id:4, stationId:4, users:[7]}
      ],
      benchUsers: [8]
    }
  }

  shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
  }

  toggleUserLock(userId){
    const newState = {...this.state, users: {...this.state.users}}
    newState.users[userId] = {...this.state.users[userId], locked:!this.state.users[userId].locked};
    this.setState(newState)
  }

  moveUser(userId, stationId){
    const newPairs = this.state.pairs.map(x=>{return {...x}})
    const newState = {...this.state, pairs: newPairs};

    this.removeUserFromAllLists(userId, newState);

    const addToPair = newState.pairs.find(p=>p.stationId===stationId);
    addToPair.users = [...addToPair.users, userId];

    //unlock user
    this.state.users[userId].locked = false;

    this.setState(newState);
  }

  benchUser(userId){
    const newState = {...this.state, benchUsers: [...this.state.benchUsers, userId]};
    this.removeUserFromAllLists(userId, newState)
    this.setState(newState);
  }

  removeUserFromAllLists(userId, newState){
    const removeFromPair = newState.pairs.find(p=>p.users.find(x=>x==userId));
    if (removeFromPair){
      removeFromPair.users = removeFromPair.users.filter(x=>x != userId);
    } else {
      newState.benchUsers = newState.benchUsers.filter(x=>x != userId)
    }
  }

  pairate(){
    let newPairs = [];
    let movingUsers = [];
    let shuffledPairs = this.shuffle([...this.state.pairs])
    shuffledPairs.forEach(oldPair=>{
      let newPair = {id:oldPair.id, stationId:oldPair.stationId, users:[]}
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

    const newState = {users: this.state.users, stations:this.state.stations, pairs:newPairs};
    this.setState(newState);
  }

  render() {
    const pairate = ()=>this.pairate();
    const toggleLock = userId=>this.toggleUserLock(userId);

    const sortedPairs = this.state.pairs.sort((a,b)=>a.id-b.id);

    const pairDivs = sortedPairs.map((p,index)=>{
      return (<Pair
        pair={p}
        users={this.state.users}
        stations={this.state.stations}
        toggleLock={toggleLock}
        moveUser={this.moveUser.bind(this)}
        key={index}/>);
    })

    const bench = (<Bench
          benchUsers={this.state.benchUsers}
          users={this.state.users}
          benchUser={this.benchUser.bind(this)}/>);

    return (
      <div>
        <button className='pairate-button' onClick={pairate}>Pairate Humans</button>
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
