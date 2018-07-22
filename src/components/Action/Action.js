import React from 'react';

export default class Action extends React.PureComponent {

  static defaultProps = {
    accuracy: 0,
    bpm: 100,
    buffers: {},
    events: [],
    lifting: null,
    start: 0
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleAction);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleAction);
  }

  handleAction = (event) => {
    const { accuracy, bpm, buffers, events, level, onAction, settings, start } = this.props;
    const { code } = event;
    const delta = 60 / bpm * 1000;
    const time = performance.now() - start;

    let timeDelta;
    let bpmIncrement = 1;
    const eventHit = events.find((event, i) => {
      timeDelta = Math.abs(bpmIncrement * delta - time);
      bpmIncrement += event.delta;
      return timeDelta < accuracy && event.hit === false && (!settings || settings[event.type] === code);
    });

    if (eventHit) {
      this.playSound(buffers[eventHit.sample]);
      eventHit.hit = timeDelta;
    }

    if (onAction) {
      onAction(eventHit, time, level, accuracy, timeDelta);
    }
  };

  playSound(buffer, time = 0) {
    const { context } = this.props;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  };

  render() {
    return null;
  }

}
