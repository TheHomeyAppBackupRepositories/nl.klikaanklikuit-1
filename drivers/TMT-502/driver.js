'use strict';

const DriverKlikAanKlikUitOldTransmitter = require('../../lib/DriverKlikAanKlikUitOldTransmitter');
const RFSignalKlikAanKlikUitOldTransmitter = require('../../lib/RFSignalKlikAanKlikUitOldTransmitter');

module.exports = class extends DriverKlikAanKlikUitOldTransmitter {

  static SIGNAL = RFSignalKlikAanKlikUitOldTransmitter;

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('TMT-502:received')
      .registerRunListener(async (args, state) => {
        return args.unitchannel === (state.unit.concat(state.channel))
            && (args.state === '1') === state.state;
      });
  }

};
