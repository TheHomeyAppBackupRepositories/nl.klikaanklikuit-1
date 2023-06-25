'use strict';

const DeviceKlikAanKlikUitNewTransmitter = require('../../lib/DeviceKlikAanKlikUitNewTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewTransmitter {

  async onCommandFirst({ state, unit, ...rest }) {
    // Stateful long presses => undefined behaviour
    if (unit.charAt(0) === '1') return;
    unit = unit.charAt('1');

    const rotated = this.getSetting('rotated');
    if (rotated === '180') {
      state = !state;

      if (unit === '0') {
        unit = '1';
      } else {
        unit = '0';
      }
    }

    await this.homey.flow
      .getDeviceTriggerCard('AWST-9000:pressed:single')
      .trigger(this, {}, { state });

    await this.homey.flow
      .getDeviceTriggerCard('AWST-9000:pressed:double')
      .trigger(this, {}, { state, unit });
  }

};
