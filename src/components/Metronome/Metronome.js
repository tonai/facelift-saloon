import React from 'react';

import { playSound } from '../../services/playSound';

export default class Metronome extends React.PureComponent {

  static defaultProps = {
    bpm: 100,
    buffers: {}
  };

  static sample = 'E808_RS-03.wav';

  timer = null;

  componentDidMount() {
    const { bpm, buffers } = this.props;
    playSound(buffers[Metronome.sample]);
    this.timer = setInterval(playSound.bind(this, buffers[Metronome.sample]), 60 / bpm * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return null
  }

}
