import React, { Component } from 'react';
import { ItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import User from './user';

const pairTarget = {
  drop(props, monitor) {
    props.benchUser(monitor.getItem().userId);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Bench extends Component {
  render() {
    const { benchUsers, users, connectDropTarget, isOver } = this.props
    const highlight = isOver ? 'highlight' : ''
    const userDivs = benchUsers.map((u,i)=>{
      const user = users[u];
      return (<User user={user} showLock={false} key={i}/>)
    });
    return connectDropTarget(
      <div className={`box ${highlight}`}>
        <div className='header'>Bench</div>
        {userDivs}
      </div>);
  }
}

export default DropTarget(ItemTypes.USER, pairTarget, collect)(Bench);
