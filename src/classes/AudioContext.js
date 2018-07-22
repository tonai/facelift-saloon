import BufferLoader from './BufferLoader';

export default class AudioContext {

  context = null;
  list = [];

  constructor(list) {
    this.list = list;
  }

  load() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new Promise(resolve => {
      this.context = new AudioContext();
      const bufferLoader = new BufferLoader(this.context, this.list, resolve);
      bufferLoader.load();
    });
  }

}
