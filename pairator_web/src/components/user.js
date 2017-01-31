import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../constants';
import { UserImages } from '../resources';

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
    const { user, historyOnStation, connectDragSource, isDragging, showLock=true } = this.props;
    const hidden = isDragging ? 'hidden' : '';

    const locked = user.locked && showLock ? 'lock_outline' : 'lock_open';
    const lockIcon = (<i className={`material-icons ${locked}`}>{locked}</i>)
    const lockButton = showLock ? (<button className='lock-button' onClick={()=>this.props.toggleLock(user.id)}>{lockIcon}</button>) : '';
    const highlight = historyOnStation > 1 ? 'highlight' : '';

    return connectDragSource(
      <div className={`user ${hidden} ${highlight}`}>
        <div className={`picture`}><img src={UserImages[user.picture]} height='100%' alt='' /></div>
        <div className='station-history'>{historyOnStation}</div>
        {lockButton}
        <div className='name' style={{cursor:'move'}}>{user.name}</div>
      </div>)
  }
}

export default DragSource(ItemTypes.USER, userSource, collect)(User);
