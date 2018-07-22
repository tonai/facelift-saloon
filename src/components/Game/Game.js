import React from 'react';

import Level from '../Level/Level';
import Header from '../Header/Header';

import './Game.css';

export default class Game extends React.PureComponent {

  maxLevel = 9;
  rounds = 1;
  state = {
    level: 1,
    play: false
  };

  handleNextLevel = () => {
    const { level } = this.state;
    if (level < this.maxLevel) {
      this.setState(state => ({
        level: state.level + 1,
        play: false
      }));
    }
  };

  handleStart = () => {
    this.setState({
      play: true
    });
  };

  handleStop = () => {
    this.setState({
      play: false
    });
  };

  render() {
    const { onHome, onScore, score, settings } = this.props;
    const { level, play } = this.state;
    return (
      <div className="Game">
        <Header onHome={onHome} score={score} title={`Level ${level}`} />
        <div className="Game__stage">
          {!play && <button className="Game__start" onClick={this.handleStart}> Are you ready ? </button>}
          {/*play && <button onClick={this.handleStop}> stop game </button>*/}
          {play && <Level
            level={level}
            rounds={this.rounds}
            onNextLevel={this.handleNextLevel}
            onScore={onScore}
            settings={settings}
            visualDelay={20}
          />}
        </div>
      </div>
    );
  }

}
