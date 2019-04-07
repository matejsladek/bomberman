import React from 'react';
import * as PIXI from 'pixi.js';
// import style from './lobby.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.setup = this.setup.bind(this);
  }

  componentDidMount() {
    this.app = new PIXI.Application(600, 600);
    this.gameCanvas.appendChild(this.app.view);
    this.app.start();
    this.setup();
  }

  setup(){
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xFFFF00);
      graphics.drawRect(0, 0, 100, 100);
      this.app.stage.addChild(graphics);
  }

  componentWillUnmount() {
    this.app.stop();
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
          <div ref={(thisDiv) => {component.gameCanvas = thisDiv}} />
        </div>
    );
  }
}

export default Game;
