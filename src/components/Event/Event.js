import React from 'react';

import { ICON_DIR } from '../../settings/settings';

import './Event.css';

export default class Event extends React.PureComponent {

  render() {
    const { accuracy, bpm, bpmPos, event, duration, icon } = this.props;
    const delta = 60 / bpm * 1000;
    return (
      <div
        className="Event"
        style={{
          left: `${(bpmPos * delta - accuracy) / duration * 100}%`,
          width: `${accuracy * 2 / duration * 100}%`
        }}
      >
        <div className="Event__area"  style={{ backgroundColor: event.color }}/>
        {icon && (<img
          className="Event__icon"
          src={`${ICON_DIR}${event.icon}`}
          alt={event.type}
        />)}
      </div>
    );
  }

}
