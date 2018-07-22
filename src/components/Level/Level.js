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
    const { game, hits, level, onAction, onBufferLoad, onRoundStart, round, settings, visualDelay } = this.props;

    return (
      <SampleLoader bpm={game.bpm} onBufferLoad={onBufferLoad} samples={this.samples}>
        <Metronome bpm={game.bpm}/>
        <Counter
          {...game}
          hits={hits}
          level={level}
          onRoundStart={onRoundStart}
          onAction={onAction}
          round={round}
          settings={settings}
          visualDelay={visualDelay}
        />
      </SampleLoader>
    );
  }

}
