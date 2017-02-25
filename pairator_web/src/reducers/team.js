export default function team(state = {}, action){
  switch (action.type){
    case 'SET_TEAM':{
      return action.team
    }
    default:{
      return state;
    }
  }
}
