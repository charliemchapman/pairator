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
  render() {
    const { pair, users, stations, toggleLock, connectDropTarget, isOver } = this.props
    const highlight = isOver ? 'highlight' : ''
    const userDivs = pair.users.map((u,i)=>{
      const user = users[u];
      return (<User user={user} toggleLock={()=>toggleLock(u)} key={i}/>)
    });
    return connectDropTarget(
      <div className={`box ${highlight}`}>
        <div className='header'>{stations[pair.stationId].name}</div>
        {userDivs}
      </div>);
  }
}

export default DropTarget(ItemTypes.USER, pairTarget, collect)(Pair);
