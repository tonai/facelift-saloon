import React from 'react';

export default class Metronome extends React.PureComponent {

  static defaultProps = {
    bpm: 100,
    buffers: {},
    context: null,
    sample: null
  };

  timer = null;

  componentDidMount() {
    const { bpm, buffers, sample } = this.props;
    this.playSound(buffers[sample]);
    this.timer = setInterval(this.playSound.bind(this, buffers[sample]), 60 / bpm * 1000);
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
