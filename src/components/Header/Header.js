import React from 'react';

import './Header.css';

export default class Header extends React.PureComponent {

  render() {
    const { onHome, score, title } = this.props;
    return (
      <div className="Header">
        {onHome && <button className="Header__prev" onClick={onHome}>&lt; Back</button>}
        <div className="Header__title">{title}</div>
        {score !== undefined && <div className="Header__score">{score}</div>}
      </div>
    );
  }

}
