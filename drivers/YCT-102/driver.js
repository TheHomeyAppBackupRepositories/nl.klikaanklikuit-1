'use strict';

const DriverKlikAanKlikUitOldTransmitter = require('../../lib/DriverKlikAanKlikUitOldTransmitter');
const RFSignalKlikAanKlikUitOldTransmitter = require('../../lib/RFSignalKlikAanKlikUitOldTransmitter');

module.exports = class extends DriverKlikAanKlikUitOldTransmitter {

  static SIGNAL = RFSignalKlikAanKlikUitOldTransmitter;

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('YCT-102:received')
      .registerRunListener(async (args, state) => {
        if (state.group) {
          return (args.state === '1') === state.state;
        }
        return args.channel === state.channel
            && (args.state === '1') === state.state
            && args.unit === state.unit;
      });
  }

};
