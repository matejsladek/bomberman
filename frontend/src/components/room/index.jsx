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
    return (
      <div>
        <button type="button" className="btn btn-secondary" onClick={this.props.backToLobby}>
          Back
        </button>
        Room {this.props.roomId}
          <button type="button" className="btn btn-success" onClick={this.props.startGame}>
              Start
          </button>
      </div>
    );
  }
}

export default Room;
