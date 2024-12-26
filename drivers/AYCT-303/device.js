'use strict';

const DeviceKlikAanKlikUitNewDimableTransmitter = require('../../lib/DeviceKlikAanKlikUitNewDimableTransmitter');

module.exports = class extends DeviceKlikAanKlikUitNewDimableTransmitter {

  async onCommandFirst({
    state, group, channel, unit,
  }, flags) {
    const button = channel + unit;

    if (typeof state === 'boolean') {
      this.log('Pressed:', group ? 'Group' : button, state ? 'On' : 'Off');
      await this.homey.flow
        .getDeviceTriggerCard('AYCT-303:pressed')
        .trigger(this, {}, {
          state, button,
        });
    } else if (typeof state === 'number') {
      this.log('Dimmed:', group ? 'Group' : button, state.toFixed(5));
      await this.homey.flow
        .getDeviceTriggerCard('AYCT-303:dimmed')
        .trigger(this, { value: state }, { button });
    }
  }

};
