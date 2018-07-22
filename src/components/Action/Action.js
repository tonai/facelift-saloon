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

  constructor(props) {
    super(props);
    this.state = {
      events: props.events.map(event => ({
        ...event,
        hit: false
      }))
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleAction);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleAction);
  }

  handleAction = (event) => {
    const { accuracy, bpm, buffers, level, onAction, settings, start } = this.props;
    const { events } = this.state;
    const { code } = event;
    const delta = 60 / bpm * 1000;
    const time = performance.now() - start;

    let index;
    let timeDelta;
    let bpmIncrement = 1;
    const eventHit = events.find((event, i) => {
      index = i;
      timeDelta = Math.abs(bpmIncrement * delta - time);
      bpmIncrement += event.delta;
      return timeDelta < accuracy && event.hit === false && (!settings || settings[event.type] === code);
    });

    if (eventHit) {
      this.playSound(buffers[eventHit.sample]);
      this.setState((state) => ({
        events: [
          ...state.events.slice(0, index),
          {
            ...eventHit,
            hit: timeDelta
          },
          ...state.events.slice(index + 1)
        ]
      }));
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
