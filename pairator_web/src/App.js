import React, { Component } from 'react';
import './App.css';
import PairList from './components/pairList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <i className="material-icons App-logo">face</i>
          <h2>Pairator</h2>
        </div>
        <PairList/>
      </div>
    );
  }
}

export default App;
