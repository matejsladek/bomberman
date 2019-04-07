import React from 'react';
// import style from './lobby.css';

class RoomEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      Room entry {this.props.data.id}, {this.props.data.players.length}/{this.props.data.size}
      <button type="button" className="btn btn-primary"
              onClick={() => this.props.handleJoinRoom(this.props.data.id)}>
        Join
      </button>
    </div>
  }
}

export default RoomEntry;
