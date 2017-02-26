export default function team(team = {}, action){
  switch (action.type){
    case 'SET_TEAM':{
      return action.team
    }
    case 'ADD_PAIR_HISTORY':{
      return {
        ...team,
        pairHistory:[
          action.newHistory,
          ...team.pairHistory
        ]
      }
    }
    case 'SET_PAIRS':{
      return {
        ...team,
        pairs: action.pairs
      }
    }
    default:{
      return {
        pairs: [],
        ...team
      };
    }
  }
}
