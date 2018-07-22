import React from 'react';

import { ICON_DIR } from '../../settings/settings';
import GameGenerator from '../../classes/GameGenerator';

import Level from '../Level/Level';
import Header from '../Header/Header';

import './Game.css';
export default class Game extends React.PureComponent {

  game = null;
  gameGenerator = null;
  maxLevel = 9;
  rounds = 1;
  state = {
    level: 1,
    play: false,
    round: 0
  };
  timer = null;

  constructor(props) {
    super(props);
    this.gameGenerator = new GameGenerator();
  }

  componentDidMount() {
    this.setState({
      round: 1
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.round === this.rounds && this.state.round > this.rounds) {
      this.handleNextLevel();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { level, round } = this.state;
    if (nextState.round !== round) {
      this.game = this.gameGenerator.generate(level);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
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
        play: false,
        round: 1
      }));
    }
  };

  handleRoundStart = () => {
    this.timer = setTimeout(this.nextRound, this.game.duration);
  };

  handleStart = () => {
    this.setState({
      play: true
    });
  };


  nextRound = () => {
    const { round } = this.state;
    if ( round <= this.rounds ) {
      this.setState(state => ({
        round: state.round + 1
      }));
    }
  };

  render() {
    const { onHome, onScore, score, settings } = this.props;
    const { level, play, round } = this.state;

    return (
      <div className="Game">
        <Header onHome={onHome} score={score} title={`Level ${level}`} />
        <div className="Game__stage">
          {!play && <button className="Game__start" onClick={this.handleStart}> Are you ready ? </button>}
          {play && round && round <= this.rounds &&  <Level
            game={this.game}
            level={level}
            onScore={onScore}
            onRoundStart={this.handleRoundStart}
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
