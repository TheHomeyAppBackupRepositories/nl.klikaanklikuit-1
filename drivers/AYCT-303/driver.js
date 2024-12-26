'use strict';

const DriverKlikAanKlikUitNewDimableTransmitter = require('../../lib/DriverKlikAanKlikUitNewDimableTransmitter');

module.exports = class extends DriverKlikAanKlikUitNewDimableTransmitter {

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('AYCT-303:pressed')
      .registerRunListener(async (args, state) => {
        const buttonMatches = args.channel === state.button;
        const stateMatches = args.state === (state.state ? '1' : '0');

        return buttonMatches && stateMatches;
      });

    this.homey.flow
      .getDeviceTriggerCard('AYCT-303:dimmed')
      .registerRunListener(async (args, state) => {
        return args.channel === state.button;
      });
  }

};
