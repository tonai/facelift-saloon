import React from 'react';

import './Progress.css';

export default class Progress extends React.PureComponent {

  static defaultProps = {
    duration: 0,
    start: 0,
    stop: false,
    visualDelay: 0,
  };

  stop = false;
  state = {
    update: true
  };
  time = 0;

  componentDidMount() {
    this.loop();
  }

  componentWillUnmount() {
    this.stop = true;
  }

  loop = () => {
    const { stop } = this.props ;
    if (!this.stop && !stop) {
      this.setState(state => ({
        update: !state.update
      }));
      requestAnimationFrame(this.loop);
    }
  };

  render() {
    const { duration, visualDelay, start, stop } = this.props ;

    if (!this.stop && !stop) {
      this.time = Math.min(performance.now() - start, duration) + visualDelay;
    }
    const width = this.time / duration * 100;
    return (
      <div className="Progress" style={{ width: `${width}%` }}/>
    );
  }

}
