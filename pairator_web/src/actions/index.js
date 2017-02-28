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
