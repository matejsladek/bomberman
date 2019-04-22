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
    this.placeBomb = this.placeBomb.bind(this);
    this.bombExplode = this.bombExplode.bind(this);
    this.pixelsToMap = this.pixelsToMap.bind(this);
    this.playerDead = this.playerDead.bind(this);
  }

  componentDidMount() {
    this.width = 600;
    this.height = 600;
    this.blockSize = this.width/12;
    this.playerStartPositions = [[0,0], [11, 0], [0, 11], [11, 11]];
    this.bombButtonJustPressed = false;
    this.config = {
      type: Phaser.AUTO,
      width: this.width,
      height: this.height,
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
    this.props.socket.on("placeBomb", this.placeBomb);
    this.props.socket.on("playerDead", this.playerDead);
  }


  preload() {
    this.scene = this.game.scene.keys["default"];
    const starPath = require("../../../assets/star.png");
    const groundPath = require("../../../assets/platform32.png");
    const bombPath = require("../../../assets/bomb.png");
    this.scene.load.image('star', starPath);
    this.scene.load.image('ground', groundPath);
    this.scene.load.image('bomb', bombPath);
    console.log('this preload', this);
  }

  generateBlocks(){
    const blocks = [];
    const notBlocks = [];
    const nei = [[0,0], [-1,0], [1, 0], [0, -1], [0, 1]];
    for (let i = 0; i < this.playerStartPositions.length; i++) {
      for (let j = 0; j < nei.length; j++) {
        const ne = nei[j];
        const bl = this.playerStartPositions[i];
        notBlocks.push([bl[0] + ne[0], bl[1] + ne[1]]);
      }
    }
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if(this.playerStartPositions.some(r => r[0] === i && r[1] === j)) continue;
        if(notBlocks.some(r => r[0] === i && r[1] === j)) continue;
        if((i + j) % 2 === 0) continue;
        const b = {};
        b.x = i*this.blockSize;
        b.y = j*this.blockSize;
        blocks.push(b);
      }
    }
    return blocks;
  }

  create() {
    const id = parseInt(getCookie('id'));
    this.blocks = this.generateBlocks();
    // const scene = this.game.scene.keys["default"];
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.players = [];
    this.platforms = [];
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      const platform = this.scene.physics.add.staticGroup();
      // this.platforms.create(600, 400, 'ground');
      // platform.create(block.x, block.y, 'ground').setScale(2).setOrigin(0,0).refreshBody();
      const pl = platform.create(block.x, block.y, 'ground').setDisplaySize(this.blockSize, this.blockSize).setOrigin(0,0).refreshBody();
      this.platforms.push(pl);
    }
    // this.platforms.create(750, 220, 'ground');
    for (let i = 0; i < this.props.room.players.length; i++) {
      const playerProps = this.props.room.players[i];
      const player = this.scene.physics.add.sprite(0, 0, 'star');
      // player.setSize(this.blockSize/2, this.blockSize/2);
      // player.displayWidth = this.blockSize/2;
      // player.displayWidth(this.blockSize/2);
      // player.setScale(2);
      player.setOrigin(0,0);
      player.setDisplaySize(this.blockSize-10, this.blockSize-10);
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      player.playerId = playerProps.id;
      player.alive = true;
      if(player.playerId === id){
        this.player = player;
      }
      this.scene.physics.add.collider(player, this.platforms);
      this.players.push(player);
    }
  }

  pixelsToMap(px, py){
    return {x: parseInt(px/this.blockSize), y: parseInt(py/this.blockSize)};
  }

  getPlayer(playerId) {
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].id === playerId) return room.players[i];
    }
  }
  update() {
    if(this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }
    if(this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }
    this.props.socket.emit("movePlayer", {
      roomId: this.props.room.id,
      player: {
        playerId: this.player.playerId,
        x: this.player.x,
        y: this.player.y,
      },
    });
    // if(this.cursors.space.isDown && !game.physics.arcade.overlap(this, level.bombs) && !this.bombButtonJustPressed) {
    if(this.cursors.space.isDown && !this.bombButtonJustPressed && this.player.alive) {
      console.log('sssssss');
      this.bombButtonJustPressed = true;

      this.props.socket.emit("placeBomb", {
        roomId: this.props.room.id,
        x: this.player.x,
        y: this.player.y,
        time: this.scene.time.now,
      });
    } else if(!this.cursors.space.isDown && this.bombButtonJustPressed) {
      this.bombButtonJustPressed = false;
    }
  }

  movePlayer(data) {
    // console.log("movePlayer sam seba");
    const myPlayerId = parseInt(getCookie('id'));
    if(this.props.room.id === data.roomId){
      if(!this.players) return;
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        if(player.playerId === myPlayerId) continue;
        if(player.playerId === data.player.playerId){
          player.x = data.player.x;
          player.y = data.player.y;
        }
      }
    }
  }

  placeBomb(data) {
    console.log('placeBomb client');
    if(this.props.room.id === data.roomId){
      const bombGroup = this.scene.physics.add.staticGroup();
      const bomb = bombGroup.create(data.x, data.y, 'bomb').setDisplaySize(this.blockSize/2, this.blockSize/2).setOrigin(0,0).refreshBody();
      setTimeout(() => this.bombExplode(bomb), 3000);
    }
  }

  bombExplode(bomb){
    console.log('bomb explode');
    bomb.disableBody(true, true);
    const pos = this.pixelsToMap(bomb.x, bomb.y);
    const nei = [[0,0], [-1,0], [1, 0], [0, -1], [0, 1]];
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      const posBlock = this.pixelsToMap(block.x, block.y);
      for (let j = 0; j < nei.length; j++) {
        const ne = nei[j];
        if(pos.x + ne[0] === posBlock.x && pos.y + ne[1] === posBlock.y){
          this.platforms[i].disableBody(true, true);
          break;
        }
      }
    }
    const playerPos = this.pixelsToMap(this.player.x, this.player.y);
    for (let j = 0; j < nei.length; j++) {
      const ne = nei[j];
      if(pos.x + ne[0] === playerPos.x && pos.y + ne[1] === playerPos.y){
        this.props.socket.emit("playerDead", {
          roomId: this.props.room.id,
          playerId: this.player.playerId,
        });
      }
    }
  }

  playerDead(data) {
    console.log('playerDead');
    if(this.props.room.id === data.roomId){
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        if(player.playerId === data.playerId){
          player.alive = false;
          player.disableBody(true, true);
        }
      }
    }
  }

  componentWillUnmount() {
    this.game.destroy();
    this.props.socket.off("movePlayer", this.movePlayer);
    this.props.socket.off("placeBomb", this.placeBomb);
    this.props.socket.off("playerDead", this.playerDead);
    console.log('konec');
  }

  render() {
    let component = this;
    console.log('this state', this.props.room);
    return (
      <div>
        <button type="button" className="btn btn-secondary" onClick={() => this.props.backToLobby(this.props.roomId)}>
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
