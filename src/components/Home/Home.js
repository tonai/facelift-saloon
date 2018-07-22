import React from 'react';

import './Home.css';

export default class Home extends React.PureComponent {

  state = {
    activeMenu: 0
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKey);
  }

  handleKey = (event) => {
    const { activeMenu } = this.state;
    switch (event.key) {
      case 'ArrowDown':
        this.updateActiveMenu(+1);
        break;

      case 'ArrowUp':
        this.updateActiveMenu(-1);
        break;

      case 'Enter':
        if (activeMenu === 0) {
          this.handlePlay();
        } else {
          this.handleSettings();
        }
        break;

      default:
    }
  };

  handlePlay = () => {
    const { onPlay } = this.props;
    if (onPlay) {
      onPlay();
    }
  };

  handleSettings = () => {
    const { onSettings } = this.props;
    if (onSettings) {
      onSettings();
    }
  };

  modulo = (value, modulo) => {
    value = value % modulo;
    return value < 0 ? value + modulo : value;
  };

  render() {
    const { activeMenu } = this.state;
    return (
      <div className="Home">
        <div className="Home__title-area">
          <h1 className="Home__title">Facelift saloon</h1>
        </div>
        <div className="Home__menu">
          <button
            className={`Home__menu-link ${activeMenu === 0 ? 'active' : ''}`}
            onClick={this.handlePlay}
          >Play</button>
          <button
            className={`Home__menu-link ${activeMenu === 1 ? 'active' : ''}`}
            onClick={this.handleSettings}
          >Settings</button>
        </div>
      </div>
    );
  }

  updateActiveMenu(diff) {
    this.setState(state => ({
      activeMenu: this.modulo(state.activeMenu + diff, 2)
    }));
  }

}