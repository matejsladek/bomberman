import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Main from './components/main';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Main />;
  }
}

export default hot(module)(App);
