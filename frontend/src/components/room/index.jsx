import React from 'react';
// import style from './lobby.css';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Lobby',
    };
  }

  render() {
    return <div>Room</div>;
  }
}

export default Room;
