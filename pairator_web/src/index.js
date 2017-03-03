import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Redirect, Route, IndexRoute, browserHistory } from 'react-router';
import reducers from './reducers/index';
import TeamList from './components/teamList';
import Team from './components/team';
import PairList from './components/pairList';
import Graphs from './components/graphs';
import EditStations from './components/editStations';
import EditUsers from './components/editUsers';

require('es6-promise').polyfill();
require('isomorphic-fetch');

let store = createStore(
  reducers,
  {},
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="/pairator/teams"/>
      <Redirect from="pairator" to="pairator/teams"/>
      <Route path="pairator" component={App}>
        <Redirect from="" to="teams"/>
        <Route path="teams" component={TeamList}/>
        <Route path="teams/:teamId" component={Team}>
          <IndexRoute component={PairList}/>
          <Route path="graphs" component={Graphs}/>
          <Route path="stations" component={EditStations}/>
          <Route path="users" component={EditUsers}/>
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
