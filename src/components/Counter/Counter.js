import React from 'react'

import Action from '../Action/Action';
import Hit from '../Hit/Hit';
import Progress from '../Progress/Progress';
import Timeline from '../Timeline/Timeline';

import './Counter.css';

export default class Counter extends React.PureComponent {

  static defaultProps = {
    bpm: 100,
    level: 1,
    round: 1
  };

  newRound = true;
  start = 0;
  state = {
    counter: 4,
    display: false,
    hits: [],
    stop: false
  };
  timer = null;

  componentDidMount() {
    const { bpm } = this.props;
    this.timer = setTimeout(this.decrement, 60 / bpm * 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { bpm, round } = this.props;
    if (prevProps.round !== round) {
      this.newRound = true;
      this.setState({
        counter: 3,
        display: false,
      });
      this.timer = setTimeout(this.decrement, 60 / bpm * 1000);
    }
    if (prevState.counter !== this.state.counter) {
      setTimeout(() =>  this.setState({
        display: true,
      }), 0);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillUpdate(nextProps, nextstate) {
    const { onRoundStart } = this.props;
    const { counter } = this.state;
    if (nextstate.counter === 0 && counter === 1) {
      this.start = performance.now();
      if (onRoundStart && this.newRound) {
        onRoundStart(this.start);
        this.newRound = false;
      }
    }
  }

  decrement = () => {
    const { bpm } = this.props;
    const { counter } = this.state;
    if (counter > 0) {
      this.timer = setTimeout(this.decrement, 60 / bpm * 1000);
    }
    this.setState(state => ({
      counter: state.counter - 1,
      display: false,
    }));
  };

  handleAction = (event, time, level, accuracy, timeDelta) => {
    const { onScore } = this.props;
    if (onScore && event) {
      onScore(level, accuracy, timeDelta);
    }
    this.setState(state => ({
      hits: [
        ...state.hits,
        { time, event },
      ]
    }));
  };

  render() {
    const { level, settings } = this.props;
    const { counter, display, hits, stop } = this.state;

    return (
      <div className="Counter">
        {counter > -1 && counter < 4 && (
          <div className="Counter__stage">
            <div className={`Counter__number ${display ? 'display' : ''}`}>
              {counter === 0 ? 'GO' : counter}
            </div>
          </div>
        )}
        <Timeline
          accuracy={this.props.accuracy}
          bpm={this.props.bpm}
          duration={this.props.duration}
          events={this.props.events}
        >
          {counter <= 0 && (<Progress
            duration={this.props.duration}
            visualDelay={this.props.visualDelay}
            start={this.start}
            stop={stop}
          />)}
          {hits.map(hit => (<Hit
            duration={this.props.duration}
            event={hit.event}
            key={hit.time}
            time={hit.time}
          />))}
        </Timeline>
        {counter <= 0 && (<Action
          {...this.props}
          level={level}
          onAction={this.handleAction}
          settings={settings}
          start={this.start}
        />)}
      </div>
    );
  }
}