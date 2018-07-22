import React from 'react';

import './Timeline.css';

export default class Timeline extends React.PureComponent {

  static defaultProps = {
    accuracy: 0,
    bpm: 100,
    duration: 0,
    events: [],
  };

  getEvents = () => {
    const { accuracy, bpm, duration, events } = this.props;
    const delta = 60 / bpm * 1000;
    let bpmIncrement = 1;
    return events.map((event, index) => {
      const area = (
        <div
          className="Timeline__event"
          key={`event-${index}`}
          style={{
            backgroundColor: event.color,
            left: `${(bpmIncrement * delta / duration - accuracy / duration) * 100}%`,
            width: `${accuracy * 2 / duration * 100}%`
          }}
        />
      );
      bpmIncrement += event.delta;
      return area;
    });
  };

  getTicks = () => {
    const { bpm, duration } = this.props;
    const delta = 60 / bpm * 1000;
    const ticks = Math.floor(duration / delta) - 1;

    return Array.apply(null, new Array(ticks))
      .map((value, index) => (
        <div
          className="Timeline__tick"
          key={`tick-${index}`}
          style={{left: `${(index + 1) * delta / duration * 100}%` }}
        />
      ));
  };

  render() {
    const { children } = this.props ;
    return (
      <div className="Timeline">
        {children}
        <div>
          {this.getEvents()}
          {this.getTicks()}
        </div>
      </div>
    );
  }

}
