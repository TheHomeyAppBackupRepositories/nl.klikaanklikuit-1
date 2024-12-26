'use strict';

const DriverKlikAanKlikUitOldTransmitter = require('../../lib/DriverKlikAanKlikUitOldTransmitter');
const RFSignalKlikAanKlikUitWST = require('../../lib/RFSignalKlikAanKlikUitWST');

module.exports = class extends DriverKlikAanKlikUitOldTransmitter {

  static SIGNAL = RFSignalKlikAanKlikUitWST;

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('WST-8800:received')
      .registerRunListener(async (args, state) => {
        return (args.state === '1') === state.state;
      });
  }

};
