'use strict';

const DeviceKlikAanKlikUitNewTransmitter = require('../../lib/DeviceKlikAanKlikUitNewTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewTransmitter {

  async onCommandFirst(command) {
    await this.homey.flow
      .getDeviceTriggerCard('AKCT-510:received')
      .trigger(this, {}, command);
  }

};
