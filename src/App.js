import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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
