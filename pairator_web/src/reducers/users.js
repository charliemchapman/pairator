export default function users(users = {}, action){
  switch (action.type){
    case 'ADD_USER':{
      const newUsers = { ...users };
      if (action.user.active){
        newUsers[action.user.userId] = action.user;
      }
      return newUsers;
    }
    case 'TOGGLE_LOCK_USER':{
      const updatedUser = { ...users[action.userId]}
      updatedUser.locked = !updatedUser.locked;
      const newUsers = {...users};
      newUsers[action.userId] = updatedUser;
      return newUsers;
    }
    case 'SET_LOCK_USER':{
      const updatedUser = { ...users[action.userId]}
      updatedUser.locked = action.lock;
      const newUsers = {...users};
      newUsers[action.userId] = updatedUser;
      return newUsers;
    }
    default:{
      return users;
    }
  }
}
