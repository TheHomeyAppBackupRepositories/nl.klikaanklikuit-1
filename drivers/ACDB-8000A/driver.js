'use strict';

const DriverKlikAanKlikUitNewTransmitter = require('../../lib/DriverKlikAanKlikUitNewTransmitter');

module.exports = class extends DriverKlikAanKlikUitNewTransmitter {

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('ACDB-8000A:received')
      .registerRunListener(async (args, state) => {
        return state.state === '1';
      });
  }

};
