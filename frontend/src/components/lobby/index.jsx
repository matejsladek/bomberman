import React from 'react';
import style from './lobby.css';
import {URL} from '../constants';
import RoomEntry from '../room-entry'

class Lobby extends React.Component {
  render() {
    const rooms = this.props.rooms;
    // console.log('roooms: ', rooms);
    return (<div>
      {rooms.map((room, i) => {
        return (
          <RoomEntry
            data={room}
            handleJoinRoom={this.props.handleJoinRoom}
            key={i}
          />);
      })}
    </div>);
  }
}

export default Lobby;
