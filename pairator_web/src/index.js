import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Redirect, Route, browserHistory } from 'react-router';
import reducers from './reducers/index';
import TeamList from './components/teamList';
import PairList from './components/pairList';
import Graphs from './components/graphs';

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
        <Route path="teams/:teamId" component={PairList}/>
        <Route path="teams/:teamId/graphs" component={Graphs}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
