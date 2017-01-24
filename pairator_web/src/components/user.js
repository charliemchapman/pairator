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
    const { user, connectDragSource, isDragging, showLock=true } = this.props;
    const hidden = isDragging ? 'hidden' : '';
    //const locked = user.locked && showLock ? 'lock_outline' : 'lock_open';
    //const lockIcon = (<i className="material-icons">{locked}</i>)
    //const lockButton = showLock ? (<button className='lock-button' onClick={()=>this.props.toggleLock(user.id)}>{lockIcon}</button>) : ''

    const locked = user.locked && showLock ? 'lock_outline' : 'lock_open';
    const lockIcon = (<i className={`material-icons ${locked}`}>{locked}</i>)
    const lockButton = showLock ? (<button className='lock-button' onClick={()=>this.props.toggleLock(user.id)}>{lockIcon}</button>) : '';

    return connectDragSource(
      <div className={`user ${hidden}`}>
        {lockButton}
        <div className='name' style={{cursor:'move'}}>{user.name}</div>
      </div>)
  }
}

export default DragSource(ItemTypes.USER, userSource, collect)(User);
