import React from 'react';

import { ICON_DIR } from '../../settings/settings';
import GameGenerator from '../../classes/GameGenerator';

import Header from '../Header/Header';
import SampleLoader from '../SampleLoader/SampleLoader';
import Metronome from '../Metronome/Metronome';
import Timeline from '../Timeline/Timeline';
import Action from '../Action/Action';
import Progress from '../Progress/Progress';
import Hit from '../Hit/Hit';

import './Settings.css';

export default class Settings extends React.PureComponent {

  game = null;
  gameGenerator = null;
  state = {
    bpm: 80,
    hits: [],
    start: false
  };
  timer = null;


  constructor(props) {
    super(props);
    this.gameGenerator = new GameGenerator();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.start === false && this.state.start > 0) {
      this.timer = setTimeout(this.handleStop, this.game.duration);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleAction = (hit, time) => {
    this.setState(state => ({
      hits: [
        ...state.hits,
        time,
      ]
    }));
  };

  handleBpmChange = (event) => {
    const bpm = +event.target.value;
    this.setState({ bpm });
  };

  handleBlur = () => {
    const bpm = Math.max(GameGenerator.minBpm, Math.min(GameGenerator.maxBpm, this.state.bpm));
    if (bpm !== this.state.bpm) {
      this.setState({ bpm });
    }
  };

  handleChange(isKey, event) {
    const { onKeyChange } = this.props;
    const { target: { name, value } } = event;
    if (!isKey && onKeyChange) {
      onKeyChange(name, value);
    }
  }

  handleKeyDown(isKey, event) {
    const { onKeyChange } = this.props;
    const { nativeEvent : { code }, target: { name } } = event;
    if (isKey && onKeyChange && code !== 'Tab') {
      onKeyChange(name, code);
    }
  }

  handleStart = () => {
    this.setState({
      hits: [],
      start: performance.now()
    });
  };

  handleStop = () => {
    this.setState({
      start: false
    });
  };

  render() {
    const { onHome, settings } = this.props;
    const { bpm, hits, start } = this.state;
    this.game = this.gameGenerator.settings(Math.max(GameGenerator.minBpm, Math.min(GameGenerator.maxBpm, bpm)));

    return (
      <div className="Settings">
        <Header onHome={onHome} title="Settings" />
        <div className="Settings__stage">
          <h2 className="Settings__title">Keys</h2>
          <div className="Settings__group">
            {this.renderRow('Lifting', 'lifting', true)}
            {this.renderRow('Hair', 'hair', true)}
            {this.renderRow('Beard', 'beard', true)}
            {this.renderRow('Wart', 'wart', true)}
          </div>
          <h2 className="Settings__title">Delay</h2>
          <div className="Settings__group">
            {this.renderRow('Visual delay', 'delay')}
          </div>
          <h2 className="Settings__title">Test</h2>
          <div className="Settings__group">
            <div className="Settings__row">
              <div className="Settings__label">BPM</div>
              <div className="Settings__field">
                <input
                  className="Settings__input"
                  name="bpm"
                  onChange={this.handleBpmChange}
                  onBlur={this.handleBlur}
                  min={GameGenerator.minBpm}
                  max={GameGenerator.maxBpm}
                  type="number"
                  value={bpm}
                />
              </div>
            </div>
            <div className="Settings__center">
              {!start && <button className="Settings__button" onClick={this.handleStart}>Launch test</button>}
              {start && <div className="Settings__text">hit any key</div>}
            </div>
          </div>
        </div>
        <SampleLoader bpm={this.game.bpm} samples={[Metronome.sample]}>
          {start && <Metronome bpm={this.game.bpm}/>}
          <Timeline {...this.game}>
            {start && <Progress {...this.game} visualDelay={settings.delay} start={start}/>}
            {hits.map(hit => <Hit duration={this.game.duration} key={hit} time={hit} />)}
          </Timeline>
          {start && (
            <Action
              {...this.game}
              onAction={this.handleAction}
              start={start}
            />
          )}
        </SampleLoader>
      </div>
    );
  }

  renderRow(label, name, isKey) {
    const { settings } = this.props;
    if (isKey) {
      label = (<img
        className="Settings__icon"
        src={`${ICON_DIR}${GameGenerator.icons[name]}`}
        alt={name}
      />);
    }
    return (
      <div className="Settings__row">
        <div className="Settings__label">{label}</div>
        <div className="Settings__field">
          <input
            className="Settings__input"
            name={name}
            onChange={this.handleChange.bind(this, isKey)}
            onKeyDown={this.handleKeyDown.bind(this, isKey)}
            value={settings[name]}
          />
        </div>
      </div>
    );
  }

}
