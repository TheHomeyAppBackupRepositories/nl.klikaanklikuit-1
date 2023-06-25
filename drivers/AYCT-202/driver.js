'use strict';

const DriverKlikAanKlikUitNewDimableTransmitter = require('../../lib/DriverKlikAanKlikUitNewDimableTransmitter');

module.exports = class extends DriverKlikAanKlikUitNewDimableTransmitter {

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('AYCT-202:received')
      .registerRunListener(async (args, state) => {
        if (state.group) state.channel = 'g';
        if (state.state === true) state.state = '1';
        if (state.state === false) state.state = '0';

        return args.channel === state.channel
         && args.state === state.state;
      });

    this.homey.flow
      .getDeviceTriggerCard('AYCT-202:pressed')
      .registerRunListener(async (args, state) => {
        const pressedButton = state.state ? '1' : '0';
        return args.state === pressedButton;
      });

    this.homey.flow
      .getDeviceTriggerCard('AYCT-202:dim-channel')
      .registerRunListener(async (args, state) => {
        if (state.group) state.channel = 'g';
        return args.channel === state.channel;
      });
  }

};
