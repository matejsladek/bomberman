import React from 'react';
import {URL} from "../constants";
// import style from './lobby.css';

class GameOver extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <button type="button" className="btn btn-secondary" onClick={() => this.props.backToLobby(this.props.roomId)}>
          Back
        </button>
        Vitaz je {this.props.winner}
      </div>
    );
  }
}

export default GameOver;
