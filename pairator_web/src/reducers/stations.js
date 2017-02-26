export default function stations(stations = {}, action){
  switch (action.type){
    case 'ADD_STATION':{
      const newStations = { ...stations };
      newStations[action.station.stationId] = action.station
      return newStations;
    }
    default:{
      return stations;
    }
  }
}
