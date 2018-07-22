export default class GameGenerator {

  static minLevel = 1;
  static maxLevel = 10;

  static minAccuracy = 70;
  static maxAccuracy = 90;

  static minBpm = 100;
  static maxBpm = 200;

  static minEvent = 1;
  static maxEvent = 6;

  static colors = {
    beard: 'green',
    hair: 'blue',
    lifting: 'red',
    wart: 'orange',
  };

  static icons = {
    beard: 'beard.svg',
    hair: 'hair.svg',
    lifting: 'clothespin.svg',
    wart: 'scalpel.svg',
  };

  static order = {
    beard: 3,
    hair: 2,
    lifting: 1,
    wart: 4,
  };

  static samples = {
    beard: 'Pop 03.wav',
    hair: 'Boing 07.wav',
    lifting: 'Reaction 08.wav',
    wart: 'Pop 03.wav',
  };

  generate(level) {
    level = Math.max(GameGenerator.minLevel, Math.min(GameGenerator.maxLevel, level));
    const accuracy = this.getInvertedLevelValue(level, GameGenerator.minAccuracy, GameGenerator.maxAccuracy);
    const bpm = this.getLevelValue(level, GameGenerator.minBpm, GameGenerator.maxBpm);

    const { events, hasBeard, hasHair } = this.getEvents(level);

    const beard = hasBeard && this.getBeard(level);
    const body = this.getBody(level);
    const face = this.getFace(level);
    const eyes = this.getEyes(level);
    const hair = hasHair && this.getHair(level);
    const mouth = this.getMouth(level);
    const nose = this.getNose(level);

    const length = events
      .map(event => event.delta)
      .reduce((a, b, index) => index === events.length - 1 && b === 0.5 ? a +b + 0.5 : (a + b), 0);
    const duration = (length + 1) * 60 / bpm * 1000;

    return {
      accuracy,
      beard,
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

  getBeard() {
    return 'BeardA.png';
  }

  getBody() {
    return 'BodyA.png';
  }

  getEvents(level) {
    const eventLength = Math.max(GameGenerator.minEvent, Math.min(GameGenerator.maxEvent, level));

    let beardEvents = [];
    let liftingEvents = [];
    let hairEvents = [];
    let wartEvents = [];

    let hasHair = true;
    let hasBeard = false;

    switch(eventLength) {
      default:
      case 4: // eslint-disable-line no-fallthrough
        wartEvents = this.getEventWart(level);
      case 3: // eslint-disable-line no-fallthrough
        hasBeard = Math.random() > this.getLevelValue(level, 0.5, 0.1);
        beardEvents = hasBeard ? this.getEventBeard(level) : [];
      case 2: // eslint-disable-line no-fallthrough
        hasHair = Math.random() > this.getLevelValue(level, 0.5, 0.1);
        hairEvents = hasHair ? [] : this.getEventHair(level);
      case 1: // eslint-disable-line no-fallthrough
        liftingEvents = this.getEventLifting(level);
        break;
    }

    return {
      events: this.getEventsMix(level, liftingEvents, hairEvents, beardEvents, wartEvents),
      hasBeard,
      hasHair
    };
  }

  getEventsMix(level, liftingEvents, hairEvents, beardEvents, wartEvents) {
    if (level < 6) {
      return liftingEvents.concat(hairEvents).concat(beardEvents).concat(wartEvents);
    } else if (level === 6) {
      const random = Math.random();
      if (random > 0.75) {
        return liftingEvents.concat(hairEvents).concat(beardEvents).concat(wartEvents);
      } else if (random > 0.5) {
        return beardEvents.concat(hairEvents).concat(liftingEvents).concat(wartEvents);
      } else if (random > 0.5) {
        return hairEvents.concat(beardEvents).concat(liftingEvents).concat(wartEvents);
      } else {
        return liftingEvents.concat(beardEvents).concat(hairEvents).concat(wartEvents);
      }
    } else if (level === 7) {
      return this.getEventsRandom([liftingEvents, hairEvents, beardEvents, wartEvents]);
    } else if (level === 8) {
      return this.getEventsRandom(liftingEvents.concat(hairEvents).concat(beardEvents).concat(wartEvents));
    } else {
      const events = this.getEventsRandom(liftingEvents.concat(hairEvents).concat(beardEvents).concat(wartEvents));
      return events.map(event => ({
        ...event,
        delta: Math.random() > 0.5 ? 0.5 : 1
      }));
    }
  }

  getEventsRandom(groups) {
    let events;
    const random = Math.random();
    for (let i = groups.length - 1; i > 0; i--) {
      if (random >= i/groups.length && random < (i + 1)/groups.length) {
        events = groups.splice(i, 1)[0];
        break;
      }
    }
    if (!events) {
      events = groups.splice(0, 1)[0];
    }
    if (groups.length > 0) {
      if (events instanceof Array) {
        events = events.concat(this.getEventsRandom(groups));
      } else {
        events = [events].concat(this.getEventsRandom(groups));
      }
    }
    return events;
  }

  getEventsDistinct(level) {
    const eventLength = Math.max(GameGenerator.minEvent, Math.min(GameGenerator.maxEvent, level));
    let events = [];

    switch(eventLength) {
      default:
      case 4: // eslint-disable-line no-fallthrough
        events = events.concat(this.getEventWart(level, 1));
      case 3: // eslint-disable-line no-fallthrough
        events = events.concat(this.getEventBeard(level));
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

  getEventBeard(level) {
    return [
      {
        asset: 'BeardA.png',
        color: GameGenerator.colors.beard,
        delta: 1,
        hit: false,
        icon: GameGenerator.icons.beard,
        sample: GameGenerator.samples.beard,
        type: 'beard',
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

  getEventWart(level, noRandom) {
    const random = noRandom || Math.random();
    const wartA = {
      asset: 'WartA.png',
      color: GameGenerator.colors.wart,
      delta: level === 4 ? 1 : 0.5,
      hit: false,
      icon: GameGenerator.icons.wart,
      sample: GameGenerator.samples.wart,
      type: 'wart',
    };
    const wartB = {
      asset: 'WartB.png',
      color: GameGenerator.colors.wart,
      delta: level === 4 ? 1 : 0.5,
      hit: false,
      icon: GameGenerator.icons.wart,
      sample: GameGenerator.samples.wart,
      type: 'wart',
    };
    const wartC = {
      asset: 'WartC.png',
      color: GameGenerator.colors.wart,
      delta: level === 4 ? 1 : 0.5,
      hit: false,
      icon: GameGenerator.icons.wart,
      sample: GameGenerator.samples.wart,
      type: 'wart',
    };
    if (random > this.getLevelValue(level, 0.8, 0.5)) {
      return [wartA, wartB, wartC];
    } else if (random > this.getLevelValue(level, 0.6, 0.3)) {
      const random = Math.random();
      if (random > 0.666) {
        return [wartA, wartB];
      } else if (random > 0.333) {
        return [wartA, wartC];
      }
      return [wartB, wartC];
    } else if (random > this.getLevelValue(level, 0.4, 0.1)) {
      const random = Math.random();
      if (random > 0.666) {
        return [wartA];
      } else if (random > 0.333) {
        return [wartB];
      }
      return [wartC];
    }
    return [];
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
