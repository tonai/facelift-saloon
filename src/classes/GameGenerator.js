export default class GameGenerator {

  static minLevel = 1;
  static maxLevel = 10;

  static minAccuracy = 50;
  static maxAccuracy = 100;

  static minBpm = 80;
  static maxBpm = 160;

  static minEvent = 1;
  static maxEvent = 6;

  static colors = {
    lifting: 'red'
  };

  static icons = {
    lifting: 'clothespin.svg',
    wart: 'scalpel.svg'
  };

  static order = {
    lifting: 1,
    wart: 2
  };

  static samples = {
    lifting: 'Reaction 08.wav'
  };

  generate(level) {
    level = Math.max(GameGenerator.minLevel, Math.min(GameGenerator.maxLevel, level));
    const accuracy = this.getInvertedLevelValue(level, GameGenerator.minAccuracy, GameGenerator.maxAccuracy);
    const bpm = this.getLevelValue(level, GameGenerator.minBpm, GameGenerator.maxBpm);
    const events = this.getEvents(level);

    const body = this.getBody(level);
    const face = this.getFace(level);
    const eyes = this.getEyes(level);
    const hair = this.getHair(level);
    const mouth = this.getMouth(level);
    const nose = this.getNose(level);

    const duration = (events.length + 1) * 60 / bpm * 1000;

    return {
      accuracy,
      body,
      bpm,
      duration,
      events,
      eyes,
      face,
      hair,
      mouth,
      nose
    };
  }

  getBody() {
    return 'BodyA.png';
  }

  getEvents(level) {
    const eventLength = Math.min(GameGenerator.minEvent, Math.max(GameGenerator.maxEvent, level));
    const events = [];
    switch(eventLength) {
      default:
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
        return events.concat(this.getLiftingEvent(level));
    }
  }

  getEventsDistinct(level) {
    return this.getEvents(level).reduce((acc, event) => {
      if (acc.indexOf(event.type) === -1) {
        acc = acc.concat(event.type);
      }
      return acc;
    }, []);
  }

  getEyes() {
    return {
      angry: 'EyesAngryA.png',
      happy: 'EyesHappyA.png',
      normal: 'EyesNormalA.png'
    };
  }

  getFace() {
    return 'FaceA.png';
  }

  getHair() {
    return 'HairA.png';
  }

  getInvertedLevelValue(level, minValue, maxValue) {
    return maxValue - (level - GameGenerator.minLevel) * (maxValue - minValue) / (GameGenerator.maxLevel - GameGenerator.minLevel);
  }

  getLevelValue(level, minValue, maxValue) {
    return minValue + (level - GameGenerator.minLevel) * (maxValue - minValue) / (GameGenerator.maxLevel - GameGenerator.minLevel);
  }

  getLiftingEvent(level) {
    return [
      {
        asset: 'WrinklesLeftA.png',
        color: GameGenerator.colors.lifting,
        delta: 1,
        hit: false,
        icon: GameGenerator.icons.lifting,
        sample: GameGenerator.samples.lifting,
        type: 'lifting',
      },
      {
        asset: 'WrinklesRightA.png',
        color: GameGenerator.colors.lifting,
        delta: 1,
        hit: false,
        icon: GameGenerator.icons.lifting,
        sample: GameGenerator.samples.lifting,
        type: 'lifting',
      }
    ];
  }

  getMouth() {
    return {
      angry: 'MouthAngryA.png',
      happy: 'MouthHappyA.png',
      normal: 'MouthNormalA.png'
    };
  }

  getNose() {
    return 'NoseA.png';
  }

  settings(bpm) {
    const level = 1;
    const accuracy = this.getInvertedLevelValue(level, GameGenerator.minAccuracy, GameGenerator.maxAccuracy);
    const events = [
      ...this.getLiftingEvent(level),
      ...this.getLiftingEvent(level),
      ...this.getLiftingEvent(level),
      ...this.getLiftingEvent(level)
    ];
    const duration = (events.length + 1) * 60 / bpm * 1000;
    return {
      accuracy,
      bpm,
      duration,
      events
    };
  }

}
