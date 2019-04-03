import React from 'react';
// import style from './lobby.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Lobby',
    };
  }

  render() {
    return <div>Game</div>;
  }
}

export default Game;
