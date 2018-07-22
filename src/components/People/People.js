import React from 'react';

import { ASSETS_DIR } from '../../settings/settings';

import './People.css';

export default class People extends React.PureComponent {

  animationDelay = 100;
  animationDuration = 500;
  reset = false;
  state = {
    enterAnimationEnd: false,
    enterAnimationStart: false
  };
  timer = null;

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ enterAnimationStart: true }), this.animationDelay);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.exitAnimation && this.props.exitAnimation) {
      this.timer = setTimeout(this.handleAnimationEnd, this.animationDuration);
    }
    if (!prevState.enterAnimationStart && this.state.enterAnimationStart) {
      this.timer = setTimeout(() => this.setState({ enterAnimationEnd: true }), this.animationDuration);
    }
    if (prevProps.game !== this.props.game) {
      this.setState({
        enterAnimationEnd: false,
        enterAnimationStart: false
      });
      this.timer = setTimeout(() => {
        this.reset = false;
        this.setState({ enterAnimationStart: true });
      }, this.animationDelay);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleAnimationEnd = () => {
    const { onAnimationEnd } = this.props;
    if (onAnimationEnd) {
      onAnimationEnd();
    }
    this.reset = true;
  };

  render() {
    const { children, exitAnimation, game, hits } = this.props;
    const { enterAnimationEnd, enterAnimationStart } = this.state;
    const hitEvents = hits.map(hit => hit.event);

    return (
      <div>
        <div className="People">
          <div
            className={`People__animation ${enterAnimationStart ? 'enter' : ''} ${exitAnimation ? 'exit' : ''}`}
            style={{ transition: this.reset ? 'none' : `all ${this.animationDuration}ms linear` }}
          >
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.body}`} alt="body" />
            </div>
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.face}`} alt="face" />
            </div>
            {this.renderWrinkles(game, hitEvents)}
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.nose}`} alt="nose" />
            </div>
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.eyes.normal}`} alt="eyes" />
            </div>
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.mouth.normal}`} alt="mouth" />
            </div>
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.eyes.normal}`} alt="eyes" />
            </div>
            <div className="People__asset-content">
              <img className="People__asset" src={`${ASSETS_DIR}${game.hair}`} alt="hair" />
            </div>
          </div>
        </div>
        {enterAnimationEnd && !exitAnimation && !this.reset && children}
      </div>
    );
  }

  renderWrinkles(game, hitEvents) {
    return game.events
      .filter(event => event.type === 'lifting')
      .filter(event => hitEvents.indexOf(event) === -1)
      .map((event, index) => (
        <div key={index} className="People__asset-content">
          <img className="People__asset" src={`${ASSETS_DIR}${event.asset}`} alt="wrinkles" />
        </div>
      ));
  }

}
