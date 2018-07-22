import React from 'react';

import GameGenerator from '../../classes/GameGenerator';
import samples  from '../../settings/samples';

import Metronome from '../Metronome/Metronome';
import SampleLoader from '../SampleLoader/SampleLoader';
import Counter from '../Counter/Counter';

export default class Level extends React.PureComponent {

  static defaultProps = {
    level: 1,
    rounds: 1
  };

  game = null;
  gameGenerator = null;
  state = {
    round: 1
  };
  timer = null;

  constructor(props) {
    super(props);
    this.gameGenerator = new GameGenerator();
  }

  componentDidUpdate(prevProps, prevState) {
    const { onNextLevel, rounds } = this.props;
    if (prevState.round === rounds && this.state.round > rounds) {
      onNextLevel();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleRoundStart = () => {
    this.timer = setTimeout(this.nextRound, this.game.duration);
  };


  nextRound = () => {
    const { rounds } = this.props;
    const { round } = this.state;
    if ( round <= rounds ) {
      this.setState(state => ({
        round: state.round + 1
      }));
    }
  };

  render() {
    const { level, onScore, rounds, settings, visualDelay } = this.props;
    const { round } = this.state;
    const gameSamples = {
      lifting: samples.reaction,
      metronome: samples.toc
    };

    if ( round <= rounds ) {
      this.game = this.gameGenerator.generate(level);
      return (
        <SampleLoader bpm={this.game.bpm} samples={Object.values(gameSamples)}>
          <Metronome bpm={this.game.bpm} sample={gameSamples.metronome}/>
          <Counter
            {...this.game}
            {...gameSamples}
            level={level}
            onRoundStart={this.handleRoundStart}
            onScore={onScore}
            round={round}
            settings={settings}
            visualDelay={visualDelay}
          />
        </SampleLoader>
      );
    }

    return null;
  }

}
