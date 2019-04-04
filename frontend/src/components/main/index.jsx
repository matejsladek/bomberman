import React from 'react';
import Lobby from '../lobby';
import Room from '../room';
import Game from '../game';
import style from './main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.joinRoom = this.joinRoom.bind(this);
    this.backToLobby = this.backToLobby.bind(this);
    this.state = {
      screen: 'Lobby',
      roomId: 0,
    };
  }

  joinRoom(id){
    const screen = "Room";
    const roomId = id;
    console.log("roomId", roomId, screen);
    this.setState({screen, roomId})
  }

  backToLobby(){
    console.log("back to lobby");
    this.setState({screen: "Lobby"});
  }

  render() {
    const { screen } = this.state;
    if (screen === 'Lobby') {
      return <Lobby handleJoinRoom={this.joinRoom}/>;
    }
    if (screen === 'Room') {
      return (
          <Room
              roomId={this.state.roomId}
              backToLobby={this.backToLobby}
          />
      );
    }
    return <Game />;
  }
}

export default Main;
