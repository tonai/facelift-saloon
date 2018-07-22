import React from 'react';
import AudioContext from '../../classes/AudioContext';

export default class SampleLoader extends React.PureComponent {

  static defaultProps = {
    bpm: 100,
    samples: []
  };

  audioContext = null;
  bufferList = [];
  sampleDir = '/samples/';
  state = {
    start: false
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const samples = this.props.samples.map(sample => `${this.sampleDir}${sample}`);
    this.audioContext = new AudioContext(samples);
    this.audioContext
      .load()
      .then(this.setBufferList)
      .then(this.start);
  };

  setBufferList = (bufferList) => {
    this.bufferList = this.props.samples
      .reduce((acc, sample, index) => {
        acc[sample] = bufferList[index];
        return acc;
      }, {});
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
    const { start } = this.state;
    if (!(children instanceof Array)) {
      children = [children];
    }
    return children
      .filter(child => typeof child === 'object')
      .map((child, index) => React.cloneElement(child, {
        ...child.props,
        buffers: this.bufferList,
        context: this.audioContext.context,
        key: index
      }))
  };

}
