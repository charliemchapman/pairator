export default function usersEditor(usersEditor = {}, action){
  switch (action.type){
    case 'RESET_USERS_EDITOR':{
      return { ...action.users };
    }
    case 'TOGGLE_USERS_EDITOR_ACTIVE':{
      const updatedUser = { ...usersEditor[action.userId] }
      updatedUser.active = !updatedUser.active;
      updatedUser.isDirty = true;
      const newUsers = { ...usersEditor };
      newUsers[action.userId] = updatedUser;
      return newUsers;
    }
    default:{
      return usersEditor;
    }
  }
}
