import React from 'react';
import {URL} from "../constants";
// import style from './lobby.css';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.startGame = this.startGame.bind();
    this.state = {
      screen: 'Lobby',
    };
  }

  async startGame() {
      try{
        await fetch(URL + `/startGame/${this.props.roomId}`);
      } catch (e){
          console.log(e);
      }
  }

  render() {
    return (
      <div>
        <button type="button" className="btn btn-secondary" onClick={this.props.backToLobby}>
          Back
        </button>
        Room {this.props.roomId}
          <button type="button" className="btn btn-success" onClick={this.startGame}>
              Start
          </button>
      </div>
    );
  }
}

export default Room;
