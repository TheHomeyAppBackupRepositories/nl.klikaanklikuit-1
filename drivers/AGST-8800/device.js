'use strict';

const DeviceKlikAanKlikUitNewTransmitter = require('../../lib/DeviceKlikAanKlikUitNewTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewTransmitter {

  async onCommandFirst({ state }) {
    const rotated = this.getSetting('rotated');
    if (rotated === '180') {
      state = !state;
    }

    this.log(state);

    await this.homey.flow
      .getDeviceTriggerCard('AGST-8800:received')
      .trigger(this, {}, { state });
  }

};
