'use strict';

const DeviceKlikAanKlikUitNewTransmitter = require('../../lib/DeviceKlikAanKlikUitNewTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewTransmitter {

  async onCommandFirst(command) {
    const rotated = this.getSetting('rotated');
    if (rotated === '180') {
      command.state = !command.state;
    }

    await this.homey.flow
      .getDeviceTriggerCard('AWMT-003:received')
      .trigger(this, {}, command);
  }

};
