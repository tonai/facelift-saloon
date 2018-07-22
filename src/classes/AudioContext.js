import BufferLoader from './BufferLoader';

// ['/samples/E808_CL-01.wav']
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
