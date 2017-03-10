
export function getTeams(){
  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/teams`)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    });
}

export function getTeam(teamId){
  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/teams/${teamId}`)
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

  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/teams/${team.teamId}`, options)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    });
}

export function putUser(user){
  let newUser = {
    userId: user.userId,
    name: user.name,
    active: user.active
  }

  var options = {
    method: 'PUT',
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify(newUser)
  };

  return fetch(`https://wzpocd33b6.execute-api.us-west-2.amazonaws.com/dev/users`, options)
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
