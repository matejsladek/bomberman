import React from 'react';
import Lobby from '../lobby';
import Room from '../room';
import Game from '../game';
import style from './main.css';
import 'bootstrap/dist/css/bootstrap.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Lobby',
    };
  }

  render() {
    const { screen } = this.state;
    if (screen === 'Lobby') {
      return <Lobby />;
    }
    if (screen === 'Room') {
      return <Room />;
    }
    return <Game />;
  }
}

export default Main;
