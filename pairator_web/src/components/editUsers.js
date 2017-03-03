import React, { Component } from 'react';
import { connect } from 'react-redux';

export class EditUsers extends Component {

  render() {
    const users = Object.keys(this.props.users).map((userId,i)=>{
      return (<div key={i}>{this.props.users[userId].name}</div>)
    })

    return (
      <div>
        <h1>Edit Users!!!</h1>
        {users}
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  return {
    team: state.team,
    users: state.users
  }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUsers);
