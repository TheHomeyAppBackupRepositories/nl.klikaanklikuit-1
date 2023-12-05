'use strict';

const DriverKlikAanKlikUitNewTransmitter = require('../../lib/DriverKlikAanKlikUitNewTransmitter');

module.exports = class extends DriverKlikAanKlikUitNewTransmitter {

  async onRFInit() {
    await super.onRFInit();

    // AYCT-102:received flow card is deprecated
    this.homey.flow
      .getDeviceTriggerCard('AYCT-102:received')
      .registerRunListener(async (args, state) => {
        if (state.group) {
          return args.channel === state.channel
            && (args.state === '1') === state.state
            && args.unit === 'g';
        }
        return args.channel === state.channel
            && (args.state === '1') === state.state
            && args.unit === state.unit;
      });

    this.homey.flow
      .getDeviceTriggerCard('AYCT-102:received:button')
      .registerRunListener(async (args, state) => {
        return args.channel === state.channel
            && (args.state === '1') === state.state
            && args.unit === state.unit;
      });

    this.homey.flow
      .getDeviceTriggerCard('AYCT-102:received:group')
      .registerRunListener(async (args, state) => {
        return (args.state === '1') === state.state;
      });
  }

};
