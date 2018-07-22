import React from 'react';

import GameGenerator from '../../classes/GameGenerator';

import Metronome from '../Metronome/Metronome';
import SampleLoader from '../SampleLoader/SampleLoader';
import Counter from '../Counter/Counter';

export default class Level extends React.PureComponent {

  static defaultProps = {
    level: 1,
    rounds: 1
  };

  samples = Object.values(GameGenerator.samples).concat(Metronome.sample);

  render() {
    const { game, level, onScore, onRoundStart, round, settings, visualDelay } = this.props;

    return (
      <SampleLoader bpm={game.bpm} samples={this.samples}>
        <Metronome bpm={game.bpm}/>
        <Counter
          {...game}
          level={level}
          onRoundStart={onRoundStart}
          onScore={onScore}
          round={round}
          settings={settings}
          visualDelay={visualDelay}
        />
      </SampleLoader>
    );
  }

}
