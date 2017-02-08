import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Redirect, Route, browserHistory } from 'react-router';
import TeamList from './components/teamList';
import PairList from './components/pairList';

require('es6-promise').polyfill();
require('isomorphic-fetch');

ReactDOM.render(

  <Router history={browserHistory}>
    <Redirect from="/" to="/teams"/>
    <Route path="/" component={App}>
      <Redirect from="" to="teams"/>
      <Route path="teams" component={TeamList}/>
      <Route path="teams/:teamId" component={PairList}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
