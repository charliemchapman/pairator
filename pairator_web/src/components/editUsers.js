import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetUsersEditor, toggleUsersEditorActive, saveUsers } from '../actions/index';

export class EditUsers extends Component {
  componentWillMount(){
    this.props.resetUsersEditor(this.props.users);
  }

  componentWillReceiveProps(nextProps){
    if (Object.keys(nextProps.users).length !== Object.keys(nextProps.usersEditor).length){
      this.props.resetUsersEditor(nextProps.users);
    }
  }

  render() {
    const activeChange = (user)=>{
      this.props.toggleUsersEditorActive(user.userId);
    }

    const saveUsers = () => {
      this.props.saveUsers(this.props.usersEditor);
    }

    const users = Object.keys(this.props.usersEditor).map((userId,i)=>{
      const user = this.props.usersEditor[userId];
      return (
        <tr key={i}>
          <td>{user.name}</td>
          <td>{user.active.toString()}</td>
          <td><input
                type="checkbox"
                checked={user.active}
                onChange={activeChange.bind(this, user)}/></td>
        </tr>)
    })

    return (
      <div>
        <h1>Users</h1>
        <div className="edit-users">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {users}
            </tbody>
          </table>
          <button className="blue-button" onClick={saveUsers}>Save</button>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  return {
    team: state.team,
    users: state.users,
    usersEditor: state.usersEditor
  }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    resetUsersEditor: (users)=>dispatch(resetUsersEditor(users)),
    toggleUsersEditorActive: (userId)=>dispatch(toggleUsersEditorActive(userId)),
    saveUsers: (users)=>dispatch(saveUsers(users))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUsers);
