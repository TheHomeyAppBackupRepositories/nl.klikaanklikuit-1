'use strict';

const DeviceKlikAanKlikUitNewDimableTransmitter = require('../../lib/DeviceKlikAanKlikUitNewDimableTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewDimableTransmitter {

  async onCommandFirst({
    state, group, channel, unit,
  }) {
    if (typeof state === 'boolean') {
      await this.homey.flow
        .getDeviceTriggerCard('AYCT-202:received')
        .trigger(this, {}, {
          state, group, channel, unit,
        });

      await this.homey.flow
        .getDeviceTriggerCard('AYCT-202:pressed')
        .trigger(this, {}, { state });
    } else if (typeof state === 'number') {
      await this.homey.flow
        .getDeviceTriggerCard('AYCT-202:dim-channel')
        .trigger(this, { value: state }, { group, channel });

      await this.homey.flow
        .getDeviceTriggerCard('AYCT-202:dim')
        .trigger(this, {
          value: state,
        });
    }
  }

};
