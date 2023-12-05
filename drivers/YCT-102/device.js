'use strict';

const DeviceKlikAanKlikUitOldTransmitter = require('../../lib/DeviceKlikAanKlikUitOldTransmitter');

module.exports = class extends DeviceKlikAanKlikUitOldTransmitter {

  async onCommandFirst({ state, group, channel, unit }) {
    // YCT-102:received flow card is deprecated
    await this.homey.flow
      .getDeviceTriggerCard('YCT-102:received')
      .trigger(this, {}, { state, group, channel, unit });

    if (group) {
      await this.homey.flow
        .getDeviceTriggerCard('YCT-102:received:group')
        .trigger(this, {}, { state });
    } else {
      await this.homey.flow
        .getDeviceTriggerCard('YCT-102:received:button')
        .trigger(this, {}, { state, channel, unit });
    }
  }

};
