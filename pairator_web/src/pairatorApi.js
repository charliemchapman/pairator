const TEAM_ID = '3f852669-e25c-4e48-8c57-f9caa73a8f6f';

export function getTeam(){
  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/teams/${TEAM_ID}`)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    });
}

export function putTeam(team){
  var options = {
    method: 'PUT',
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify(team)
  };

  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/teams/${TEAM_ID}`, options)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    });
}

export function getUser(userId){
  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/users/${userId}`)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    });
}

export function getStation(stationId){
  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/stations/${stationId}`)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    });
}
