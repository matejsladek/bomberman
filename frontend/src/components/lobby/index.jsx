import React from 'react';
import style from './lobby.css';
import {URL} from '../constants';
import RoomEntry from '../room-entry'

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    };
  }

  async componentDidMount() {
    try{
      const res = await fetch(URL + "/rooms", {
        credentials: 'include'
      });
      const rooms = await res.json();
      this.setState({rooms});
    } catch(e){
      console.log(e);
    }
  }

  render() {
    const rooms = this.state.rooms;
    console.log('roooms: ', rooms);
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
