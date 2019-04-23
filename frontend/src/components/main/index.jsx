import React from 'react';
import Lobby from '../lobby';
import Room from '../room';
import Game from '../game';
import GameOver from '../gameOver';
import style from './main.css';
import io from 'socket.io-client'
import {URL} from "../constants";
import UUID from 'uuid/v4';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.joinRoom = this.joinRoom.bind(this);
    this.backToLobby = this.backToLobby.bind(this);
    this.startGameEvent = this.startGameEvent.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.changePlayers = this.changePlayers.bind(this);
    this.goGameOver = this.goGameOver.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.state = {
      screen: 'Lobby',
      // screen: 'Game',
      myId: UUID(),
      roomId: 0,
      rooms: [],
      gameId: "",
    };
    this.socket = io(URL);
    this.socket.on('connect', this.connectSocket);
    this.socket.on('startGame', this.startGameEvent);
    this.socket.on('changePlayers', this.changePlayers);
    console.log("myId", this.state.myId);
  }

  componentDidMount() {
    this.getRooms();
  }

  connectSocket(){
    this.socket.emit('login', {myId: this.state.myId});
  }

  startGameEvent(data){
    if(this.state.screen === "Room" && this.state.roomId === parseInt(data.roomId)){
      console.log('start');
      this.setState({screen: "Game", gameId: data.id});
    } else{
      this.getRooms();
    }
    console.log('startgameevent data', data);
  }

  changePlayers(data){
    this.setState({rooms: data});
    console.log('changeplayers data', data);
  }

  async joinRoom(roomId){
    const screen = "Room";
    const res = await fetch(URL + `/joinRoom/${roomId}/${this.state.myId}`);
    const rooms = await res.json();
    console.log('joinRoom', rooms);
    this.setState({screen, roomId, rooms});
  }

  async backToLobby(roomId){
    console.log("back to lobby");
    const res = await fetch(URL + `/leaveRoom/${roomId}/${this.state.myId}`);
    const rooms = await res.json();
    this.setState({screen: "Lobby", rooms});
  }

  async getRooms(){
    try{
      const res = await fetch(URL + "/rooms");
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

  goGameOver(winner){
    this.setState({screen: "GameOver", winner});
    // this.getRooms();
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
    if (screen === 'Game') {
      return (
        <Game
          key={this.state.gameId}
          myId={this.state.myId}
          roomId={this.state.roomId}
          room={this.getRoom(roomId)}
          backToLobby={this.backToLobby}
          goGameOver={this.goGameOver}
          socket={this.socket}
        />
      );
    }
    if (screen === 'GameOver') {
      return (
        <GameOver
          backToLobby={this.backToLobby}
          roomId={this.state.roomId}
          winner={this.state.winner}
        />
      );
    }
  }
}

export default Main;
