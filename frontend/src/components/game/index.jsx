import React from 'react';
import * as Phaser from 'phaser';
import {getCookie} from '../helpers';

// import style from './lobby.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.preload = this.preload.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
  }

  componentDidMount() {
    this.config = {
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update,
      },
      physics: {
        default: 'arcade',
      },
      parent: "parent-game",
    };

    this.game = new Phaser.Game(this.config);
    this.props.socket.on("movePlayer", this.movePlayer);
  }

  preload() {
    const scene = this.game.scene.keys["default"];
    const starPath = require("../../../assets/star.png");
    scene.load.image('star', starPath);
    console.log('this preload', this);
  }

  create() {
    const scene = this.game.scene.keys["default"];
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.players = [];
    for (let i = 0; i < this.props.room.players.length; i++) {
      const playerProps = this.props.room.players[i];
      const player = scene.physics.add.sprite(100, 450, 'star');
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      player.playerId = playerProps.id;
      this.players.push(player);
    }
  }

  getPlayer(playerId) {
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].id === playerId) return room.players[i];
    }
  }
  update() {
    const id = parseInt(getCookie('id'));
    let player = null;
    for (let i = 0; i < this.players.length; i++) {
      const x = this.players[i];
      if(x.playerId === id) player = x;
    }
    if(this.cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }
    if(this.cursors.up.isDown) {
      player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      player.setVelocityY(160);
    } else {
      player.setVelocityY(0);
    }
    this.props.socket.emit("movePlayer", {
      roomId: this.props.room.id,
      player: {
        playerId: player.playerId,
        x: player.x,
        y: player.y,
      },
    });
  }

  movePlayer(data) {
    console.log("movePlayer sam seba");
    const myPlayerId = parseInt(getCookie('id'));
    if(this.props.room.id === data.roomId){
      if(!this.players) return;
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        console.log('cudzi');
        if(player.playerId === myPlayerId) continue;
        if(player.playerId === data.player.playerId){
          player.x = data.player.x;
          player.y = data.player.y;
        }
      }
    }
  }

  render() {
    let component = this;
    console.log('this state', this.props.room);
    return (
      <div>
        <button type="button" className="btn btn-secondary" onClick={this.props.backToLobby}>
          Back
        </button>
        game:
        <div id="parent-game" ref={(thisDiv) => {
          component.gameCanvas = thisDiv
        }}/>
      </div>
    );
  }
}

export default Game;
