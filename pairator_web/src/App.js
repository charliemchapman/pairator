import React, { Component } from 'react';
import './App.css';
import logo from './resources/pear-logo.svg'
import PairList from './components/pairList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="pear-logo back" alt="logo" />
          <img src={logo} className="pear-logo front" alt="logo" />
          <h2>Pairator</h2>
        </div>
        <PairList/>
      </div>
    );
  }
}

export default App;
