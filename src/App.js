import React from 'react';

import Home from './components/Home/Home';
import Game from './components/Game/Game';
import Settings from './components/Settings/Settings';

export default class App extends React.PureComponent {

  constructor(props) {
    super(props);
    const defaultSettings = {
      delay: 0,
      beard: 'Digit3',
      hair: 'Digit2',
      lifting: 'Digit1',
      // wart: 'Digit2'
    };
    const settings = this.getSettings();
    this.state = {
      settings: settings ? settings : defaultSettings,
      score: 0,
      screen: 'home'
    };
  }

  getScore(level, accuracy, timeDelta) {
    return Math.round(1000 - 600 * timeDelta / accuracy);
  }

  getSettings() {
  let settings;
    try {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        if (parsedSettings instanceof Object) {
          settings = parsedSettings;
        }
      }
    } catch(e) {}
    return settings;
  }

  handleHome = () => {
    this.setState({
      screen: 'home'
    });
  };

  handleKeyChange = (keyName, key) => {
    this.setState(state => {
      const settings = {
        ...state.settings,
        [keyName]: key
      };
      localStorage.setItem('settings', JSON.stringify(settings));
      return { settings };
    });
  };

  handlePlay = () => {
    this.setState({
      screen: 'play'
    });
  };

  handleSettings = () => {
    this.setState({
      screen: 'settings'
    });
  };

  handleScore = (level, accuracy, timeDelta) => {
    const score = this.getScore(level, accuracy, timeDelta);
    this.setState(state => ({
      score: state.score + score
    }));
  };

  render() {
    const { settings, screen, score } = this.state;
    return (
      <div>
        {screen === 'home' && (<Home
          onPlay={this.handlePlay}
          onSettings={this.handleSettings}
        />)}
        {screen === 'play' && (<Game
          onHome={this.handleHome}
          onScore={this.handleScore}
          score={score}
          settings={settings}
        />)}
        {screen === 'settings' && (<Settings
          onHome={this.handleHome}
          onKeyChange={this.handleKeyChange}
          settings={settings}
        />)}
      </div>
    );
  }

}
