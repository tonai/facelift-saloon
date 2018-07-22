import React from 'react';

export default class Metronome extends React.PureComponent {

  static defaultProps = {
    bpm: 100,
    buffers: {},
    context: null
  };

  static sample = 'E808_RS-03.wav';

  timer = null;

  componentDidMount() {
    const { bpm, buffers } = this.props;
    this.playSound(buffers[Metronome.sample]);
    this.timer = setInterval(this.playSound.bind(this, buffers[Metronome.sample]), 60 / bpm * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  playSound(buffer, time = 0) {
    const { context } = this.props;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  };

  render() {
    return null
  }

}
