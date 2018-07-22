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
            {game.body && this.renderAsset(game.body)}
            {game.face && this.renderAsset(game.face)}
            {this.renderWrinkles(game, hitEvents)}
            {game.nose && this.renderAsset(game.nose)}
            {this.renderAsset(game.eyes.normal)}
            {this.renderAsset(game.mouth.normal)}
            {game.hair && this.renderAsset(game.hair)}
            {this.renderHair(game, hitEvents)}
          </div>
        </div>
        {enterAnimationEnd && !exitAnimation && !this.reset && children}
      </div>
    );
  }

  renderAsset(asset, key) {
    return (
      <div key={key} className="People__asset-content">
        <img className="People__asset" src={`${ASSETS_DIR}${asset}`} alt="" />
      </div>
    );
  }

  renderHair(game, hitEvents) {
    const event = game.events
      .filter(event => event.type === 'hair')
      .find(event => hitEvents.indexOf(event) !== -1);
    return event ? this.renderAsset(event.asset) : null;
  }

  renderWrinkles(game, hitEvents) {
    return game.events
      .filter(event => event.type === 'lifting')
      .filter(event => hitEvents.indexOf(event) === -1)
      .map((event, index) => this.renderAsset(event.asset, index));
  }

}
