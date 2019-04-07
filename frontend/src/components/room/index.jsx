import React from 'react';
import {URL} from "../constants";
// import style from './lobby.css';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.startGame = this.startGame.bind(this);
  }

  async startGame() {
      try{
        await fetch(URL + `/startGame/${this.props.roomId}`, {credentials: 'include'});
      } catch (e){
          console.log(e);
      }
  }

  render() {
    return (
      <div>
        <button type="button" className="btn btn-secondary" onClick={_ => this.props.backToLobby(this.props.roomId)}>
          Back
        </button>
        Room {this.props.roomId} hracov: {this.props.room && this.props.room.players.length}
          <button type="button" className="btn btn-success" onClick={this.startGame}>
              Start
          </button>
      </div>
    );
  }
}

export default Room;
