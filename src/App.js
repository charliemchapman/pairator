import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: {
        1: {name:'Charlie'},
        2: {name:'Greg'},
        3: {name:'Ray'},
        4: {name:'Charles'},
        5: {name:'Beau'},
        6: {name:'Chad'},
        7: {name:'Jim'}
      },
      pairs: [
        {id:1, name:'DEV1', users:[1,2]},
        {id:2, name:'DEV2', users:[3,4]},
        {id:2, name:'DEV2', users:[5,6]},
        {id:2, name:'DEV2', users:[7]}
      ]
    }
  }

  shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
  }

  render() {
    const pairate = ()=>{
      let newPairs = this.state.pairs.map(p=>{return{id:p.id, name:p.name, users:[...p.users]};});
      let usersToMove = [];
      newPairs.forEach(p=>{
        usersToMove.push(...p.users.slice(1,p.users.length));
        p.users = [p.users[0]]
      });

      const shuffledPairs = this.shuffle([...newPairs])
      shuffledPairs.slice(0,usersToMove.length).forEach((p,i)=>{
        p.users.push(usersToMove[i]);
      })

      const newState = {users: this.state.users, pairs:newPairs};
      this.setState(newState);
    }

    const pairDivs = this.state.pairs.map((p,index)=>{
      const userDivs = p.users.map((u,i)=>(<div key={i}>{this.state.users[u].name}</div>))
      return (<div key={index} style={{padding: 20}}>{p.name}{userDivs}</div>);
    })

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <button style={{padding: 20, margin:20}} onClick={pairate}>Pairate Humans</button>
        {pairDivs}
      </div>
    );
  }
}

export default App;
