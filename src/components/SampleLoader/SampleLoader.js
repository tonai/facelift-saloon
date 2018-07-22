import React from 'react';

import { SAMPLE_DIR } from '../../settings/settings';
import AudioContext from '../../classes/AudioContext';
import { setContext } from '../../services/playSound';

export default class SampleLoader extends React.PureComponent {

  static defaultProps = {
    bpm: 100,
    samples: []
  };

  audioContext = null;
  bufferList = [];
  state = {
    start: false
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const samples = this.props.samples.map(sample => `${SAMPLE_DIR}${sample}`);
    this.audioContext = new AudioContext(samples);
    this.audioContext
      .load()
      .then(this.setBufferList)
      .then(this.start);
  };

  setBufferList = (bufferList) => {
    const { onBufferLoad } = this.props;
    this.bufferList = this.props.samples
      .reduce((acc, sample, index) => {
        acc[sample] = bufferList[index];
        return acc;
      }, {});
    setContext(this.audioContext);
    if (onBufferLoad) {
      onBufferLoad(this.bufferList);
    }
  };

  start = () => {
    this.setState({ start: performance.now() });
  };

  render() {
    const { start } = this.state;
    if (!start) {
      return null
    }
    return this.renderChildren();
  }

  renderChildren = () => {
    let { children } = this.props;
    if (!(children instanceof Array)) {
      children = [children];
    }
    return children
      .filter(child => typeof child === 'object')
      .map((child, index) => React.cloneElement(child, {
        ...child.props,
        buffers: this.bufferList,
        key: index
      }))
  };

}
