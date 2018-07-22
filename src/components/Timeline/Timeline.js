import React from 'react';

import Event from '../Event/Event';

import './Timeline.css';

export default class Timeline extends React.PureComponent {

  static defaultProps = {
    accuracy: 0,
    bpm: 100,
    duration: 0,
    events: [],
  };

  getEvents = () => {
    const { accuracy, bpm, duration, events, icon } = this.props;
    let bpmPos = 1;
    return events.map((event, index) => {
      const area = (
        <Event
          key={`event-${index}`}
          accuracy={accuracy}
          bpm={bpm}
          bpmPos={bpmPos}
          duration={duration}
          event={event}
          icon={icon}
        />
      );
      bpmPos += event.delta;
      return area;
    });
  };

  getTicks = () => {
    const { bpm, duration } = this.props;
    const delta = 60 / bpm * 1000 / 2;
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
        {this.getEvents()}
        {this.getTicks()}
        {children}
      </div>
    );
  }

}
