import { getTeam, getUser, getStation } from '../pairatorApi';

export function setTeam(team){
  return {
    type: 'SET_TEAM',
    team: team
  };
}

export function addStation(station){
  return {
    type: 'ADD_STATION',
    station: station
  };
}

export function addUser(user){
  return {
    type: 'ADD_USER',
    user: user
  };
}

export function addActiveUser(user){
  return {
    type: 'ADD_ACTIVE_USER',
    user: user
  };
}

export function toggleLock(userId){
  return {
    type: 'TOGGLE_LOCK_USER',
    userId: userId
  };
}

export function setLock(userId, lock){
  return {
    type: 'SET_LOCK_USER',
    userId: userId,
    lock: lock
  };
}

export function resetUsersEditor(users){
  return {
    type: 'RESET_USERS_EDITOR',
    users: users
  };
}

export function toggleUsersEditorActive(userId){
  return {
    type: 'TOGGLE_USERS_EDITOR_ACTIVE',
    userId: userId
  };
}

export function getTeamData(teamId){
  return (dispatch, getState) => {
    return getTeam(teamId).then((response)=>{
      const users = {};
       response.Item.userIds.forEach((userId, i)=>{
        users[userId] = {id: userId}
      });

      const stations = {};
      response.Item.stationIds.forEach((stationId, i)=>{
        stations[stationId] = {id:stationId}
      });

      dispatch(setTeam(response.Item));

      Object.keys(users).forEach(userId=>{
        getUser(userId).then(userResponse=>{
          dispatch(addUser(userResponse.Item))
        })
      })

      Object.keys(stations).forEach(stationId=>{
        getStation(stationId).then(stationResponse=>{
          dispatch(addStation(stationResponse.Item));
        })
      })
    })
  }
}
