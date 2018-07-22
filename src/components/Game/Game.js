import React from 'react';

import { ICON_DIR } from '../../settings/settings';
import GameGenerator from '../../classes/GameGenerator';

import Level from '../Level/Level';
import Header from '../Header/Header';

import './Game.css';
export default class Game extends React.PureComponent {

  gameGenerator = null;
  maxLevel = 9;
  rounds = 1;
  state = {
    level: 1,
    play: false
  };

  constructor(props) {
    super(props);
    this.gameGenerator = new GameGenerator();
  }


  getIcons = () => {
    const { level } = this.state;
    const icons = this.gameGenerator.getEventsDistinct(level)
      .sort((a, b) => GameGenerator.order[a] - GameGenerator.order[b])
      .map(name => ({
        color: GameGenerator.colors[name],
        icon: GameGenerator.icons[name],
        name
      }));
    return icons;
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
          <div className="Game__icons">
            {this.getIcons().map(({ color, icon, name }) => (
              <div className="Game__icon-item" key={name}>
                <div className="Game__icon-content">
                  <div className="Game__icon-bg" style={{ backgroundColor: color }}/>
                  <img
                    className="Game__icon"
                    src={`${ICON_DIR}${icon}`}
                    alt={name}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

}
