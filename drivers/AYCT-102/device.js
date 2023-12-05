'use strict';

const DeviceKlikAanKlikUitNewTransmitter = require('../../lib/DeviceKlikAanKlikUitNewTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewTransmitter {

  async onCommandFirst({ state, group, channel, unit }) {
    // AYCT-102:received flow card is deprecated
    await this.homey.flow
      .getDeviceTriggerCard('AYCT-102:received')
      .trigger(this, {}, { state, group, channel, unit });

    if (group) {
      await this.homey.flow
        .getDeviceTriggerCard('AYCT-102:received:group')
        .trigger(this, {}, { state });
    } else {
      await this.homey.flow
        .getDeviceTriggerCard('AYCT-102:received:button')
        .trigger(this, {}, { state, channel, unit });
    }
  }

};
