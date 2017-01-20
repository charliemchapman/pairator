import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../constants'

const userSource = {
  beginDrag(props) {
    return {userId:props.user.id};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class User extends Component {

  render() {
    const { user, connectDragSource, isDragging } = this.props;
    const display = isDragging ? 'none' : 'block';
    const locked = user.locked ? '(locked)' : '';
    return connectDragSource(
      <div style={{display:display}}>
        <button onClick={()=>this.props.toggleLock(user.id)}>L</button>
        <span style={{cursor:'move'}}>{user.name} {locked}</span>
      </div>)
  }
}

export default DragSource(ItemTypes.USER, userSource, collect)(User);
