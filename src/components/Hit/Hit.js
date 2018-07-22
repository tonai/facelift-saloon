import React from 'react';

import './Hit.css';

export default class Hit extends React.PureComponent {

  render() {
    const { duration, event, time } = this.props;
    return (
      <div
        className="Hit"
        style={{
          backgroundColor: event && event.color,
          left: `${time / duration * 100}%`
        }}
      />
    );
  }

}
