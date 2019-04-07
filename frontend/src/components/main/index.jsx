import React from 'react';
import Lobby from '../lobby';
import Room from '../room';
import Game from '../game';
import style from './main.css';
import io from 'socket.io-client'
import {URL} from "../constants";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.joinRoom = this.joinRoom.bind(this);
    this.backToLobby = this.backToLobby.bind(this);
    this.startGameEvent = this.startGameEvent.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.state = {
      screen: 'Lobby',
      // screen: 'Game',
      roomId: 0,
      rooms: [],
    };
    this.socket = io('http://localhost:80');
    this.socket.on('startGame', this.startGameEvent);
  }

  componentDidMount() {
    this.getRooms();
  }

  startGameEvent(data){
    if(this.state.screen === "Room" && this.state.roomId === parseInt(data.roomId)){
      this.setState({screen: "Game"});
    } else{
      this.getRooms();
    }
    console.log('startgameevent data', data);
  }

  async joinRoom(roomId){
    const screen = "Room";
    const res = await fetch(URL + `/joinRoom/${roomId}`, {credentials: 'include'});
    const rooms = await res.json();
    console.log('joinRoom', rooms);
    this.setState({screen, roomId, rooms});
  }

  async backToLobby(roomId){
    console.log("back to lobby");
    const res = await fetch(URL + `/leaveRoom/${roomId}`, {credentials: 'include'});
    const rooms = await res.json();
    this.setState({screen: "Lobby", rooms});
  }

  async getRooms(){
    try{
      const res = await fetch(URL + "/rooms", {credentials: 'include'});
      const rooms = await res.json();
      this.setState({rooms});
    } catch(e){
      console.log(e);
    }
  }

  getRoom(id){
    const rooms = this.state.rooms;
    for (let i = 0; i < rooms.length; i++) {
      if(rooms[i].id === id) return rooms[i];
    }
  }

  render() {
    const screen = this.state.screen;
    const roomId = this.state.roomId;
    console.log('main state', this.state);
    if (screen === 'Lobby') {
      return (
          <Lobby
              handleJoinRoom={this.joinRoom}
              rooms={this.state.rooms}
          />);
    }
    if (screen === 'Room') {
      return (
          <Room
              roomId={this.state.roomId}
              room={this.getRoom(roomId)}
              backToLobby={this.backToLobby}
          />
      );
    }
    return (
        <Game
            roomId={this.state.roomId}
            room={this.getRoom(roomId)}
            backToLobby={this.backToLobby}
        />
    );
  }
}

export default Main;
