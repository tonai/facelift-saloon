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
    const duration = (events.length + 1) * 60 / bpm * 1000;
    return {
      accuracy,
      bpm,
      duration,
      events
    };
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

  getInvertedLevelValue(level, minValue, maxValue) {
    return maxValue - (level - GameGenerator.minLevel) * (maxValue - minValue) / (GameGenerator.maxLevel - GameGenerator.minLevel);
  }

  getLevelValue(level, minValue, maxValue) {
    return minValue + (level - GameGenerator.minLevel) * (maxValue - minValue) / (GameGenerator.maxLevel - GameGenerator.minLevel);
  }

  getLiftingEvent(level) {
    return [
      {
        color: GameGenerator.colors.lifting,
        delta: 1,
        icon: GameGenerator.icons.lifting,
        sample: GameGenerator.samples.lifting,
        type: 'lifting',
      },
      {
        color: GameGenerator.colors.lifting,
        delta: 1,
        icon: GameGenerator.icons.lifting,
        sample: GameGenerator.samples.lifting,
        type: 'lifting',
      }
    ];
  }

}
