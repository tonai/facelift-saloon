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
    hair: 'blue',
    lifting: 'red',
  };

  static icons = {
    hair: 'hair.svg',
    lifting: 'clothespin.svg',
    // wart: 'scalpel.svg',
  };

  static order = {
    hair: 2,
    lifting: 1,
    // wart: 4
  };

  static samples = {
    hair: 'Boing 07.wav',
    lifting: 'Reaction 08.wav',
  };

  generate(level) {
    level = Math.max(GameGenerator.minLevel, Math.min(GameGenerator.maxLevel, level));
    const accuracy = this.getInvertedLevelValue(level, GameGenerator.minAccuracy, GameGenerator.maxAccuracy);
    const bpm = this.getLevelValue(level, GameGenerator.minBpm, GameGenerator.maxBpm);

    const { events, hasAir } = this.getEvents(level);

    const body = this.getBody(level);
    const face = this.getFace(level);
    const eyes = this.getEyes(level);
    const hair = hasAir && this.getHair(level);
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
    const eventLength = Math.max(GameGenerator.minEvent, Math.min(GameGenerator.maxEvent, level));

    let liftingEvents = [];
    let hairEvents = [];

    let hasAir = true;

    switch(eventLength) {
      default:
      case 5: // eslint-disable-line no-fallthrough
      case 4: // eslint-disable-line no-fallthrough
      case 3: // eslint-disable-line no-fallthrough
      case 2: // eslint-disable-line no-fallthrough
        hasAir = Math.random() > 0.5;
        hairEvents = hasAir ? [] : this.getEventHair(level);
      case 1: // eslint-disable-line no-fallthrough
        liftingEvents = this.getEventLifting(level);
        break;
    }

    return {
      events: liftingEvents.concat(hairEvents),
      hasAir
    };
  }

  getEventsDistinct(level) {
    const eventLength = Math.max(GameGenerator.minEvent, Math.min(GameGenerator.maxEvent, level));
    let events = [];

    switch(eventLength) {
      default:
      case 5: // eslint-disable-line no-fallthrough
      case 4: // eslint-disable-line no-fallthrough
      case 3: // eslint-disable-line no-fallthrough
      case 2: // eslint-disable-line no-fallthrough
        events = events.concat(this.getEventHair(level));
      case 1: // eslint-disable-line no-fallthrough
        return events.concat(this.getEventLifting(level))
          .reduce((acc, event) => {
            if (acc.indexOf(event.type) === -1) {
              acc = acc.concat(event.type);
            }
            return acc;
          }, []);
    }
  }

  getEyes() {
    return {
      angry: 'EyesAngryA.png',
      happy: 'EyesHappyA.png',
      normal: 'EyesNormalA.png'
    };
  }

  getEventLifting(level) {
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

  getEventHair(level) {
    return [
      {
        asset: 'HairA.png',
        color: GameGenerator.colors.hair,
        delta: 1,
        hit: false,
        icon: GameGenerator.icons.hair,
        sample: GameGenerator.samples.hair,
        type: 'hair',
      }
    ];
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
      ...this.getEventLifting(level),
      ...this.getEventLifting(level),
      ...this.getEventLifting(level),
      ...this.getEventLifting(level)
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
