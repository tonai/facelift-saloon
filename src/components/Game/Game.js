import React from 'react';

import { ICON_DIR } from '../../settings/settings';
import GameGenerator from '../../classes/GameGenerator';

import Level from '../Level/Level';
import Header from '../Header/Header';
import People from '../People/People';

import './Game.css';

export default class Game extends React.PureComponent {

  animationDelay = 100;
  game = null;
  gameGenerator = null;
  maxLevel = 9;
  rounds = 2;
  state = {
    exitAnimation: false,
    hits: [],
    level: 1,
    play: false,
    round: 0,
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

  componentWillUpdate(nextProps, nextState) {
    const { round } = this.state;
    if (nextState.round !== round) {
      this.game = this.gameGenerator.generate(nextState.level);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getIcons = () => {
    const { level } = this.state;
    return this.gameGenerator.getEventsDistinct(level)
      .sort((a, b) => GameGenerator.order[a] - GameGenerator.order[b])
      .map(name => ({
        color: GameGenerator.colors[name],
        icon: GameGenerator.icons[name],
        name
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

  handleExitAnimationEnd = () => {
    if (this.state.round === this.rounds) {
      this.timer = setTimeout(this.nextLevel, this.animationDelay);
    } else {
      this.timer = setTimeout(this.nextRound, this.animationDelay);
    }
  };

  handleExitAnimationStart = () => {
    this.setState({
      exitAnimation: true
    });
  };

  handleRoundStart = () => {
    this.timer = setTimeout(this.handleExitAnimationStart, this.game.duration);
  };

  handleStart = () => {
    this.setState({
      play: true
    });
  };

  nextLevel = () => {
    const { level } = this.state;
    if (level < this.maxLevel) {
      this.setState(state => ({
        exitAnimation: false,
        hits: [],
        level: state.level + 1,
        play: false,
        round: 1
      }));
    }
  };

  nextRound = () => {
    const { round } = this.state;
    if ( round <= this.rounds ) {
      this.setState(state => ({
        exitAnimation: false,
        hits: [],
        round: state.round + 1
      }));
    }
  };

  render() {
    const { onHome, score, settings } = this.props;
    const { exitAnimation, hits, level, play, round } = this.state;

    return (
      <div className="Game">
        <Header onHome={onHome} score={score} title={`Level ${level}`} />
        <div className="Game__stage">
          {!play && <button className="Game__start" onClick={this.handleStart}> Are you ready ? </button>}
          {play && round && (
            <People
              exitAnimation={exitAnimation}
              game={this.game}
              hits={hits}
              onAnimationEnd={this.handleExitAnimationEnd}
            >
              <Level
                game={this.game}
                hits={hits}
                level={level}
                onAction={this.handleAction}
                onRoundStart={this.handleRoundStart}
                settings={settings}
                visualDelay={20}
              />
            </People>
          )}
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
