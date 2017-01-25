import React, { Component } from 'react';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import User from './user';

const pairTarget = {
  drop(props, monitor) {
    props.moveUser(monitor.getItem().userId, props.pair.stationId);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Pair extends Component {
  timeOnStation(user, stationId, pairHistory){
    pairHistory.sort((a,b)=>{return b.id-a.id;});
    let count = 0;
    const stationHistory = pairHistory.map(p=>{
      return p.pairs.filter(x=>x.stationId == stationId)[0];
    });

    let done = false;
    for(let i = 0; i < stationHistory.length && !done; i++){
      if (stationHistory[i].users.filter(u=>u==user).length){
        count++;
      } else {
        done = true;
      }
    }

    return count;
  }

  render() {
    const { pair, users, stations, pairHistory=[], toggleLock, connectDropTarget, isOver } = this.props
    const highlight = isOver ? 'highlight' : '';

    const userDivs = pair.users.map((u,i)=>{
      const user = users[u];
      return (<User
        user={user}
        pairHistory={pairHistory}
        toggleLock={()=>toggleLock(u)}
        historyOnStation={this.timeOnStation(u, pair.stationId, pairHistory)}
        key={i}/>)
    });
    return connectDropTarget(
      <div className={`box ${highlight}`}>
        <div className='header'>{stations[pair.stationId].name}</div>
        <div className='usersBox'>
          {userDivs}
        </div>
      </div>);
  }
}

export default DropTarget(ItemTypes.USER, pairTarget, collect)(Pair);
