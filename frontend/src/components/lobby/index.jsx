import React from 'react';
import style from './lobby.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Lobby',
    };
  }

  render() {
    return <div>Lobby</div>;
  }
}

export default Lobby;
