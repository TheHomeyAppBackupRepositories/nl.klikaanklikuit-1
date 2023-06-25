'use strict';

const DeviceKlikAanKlikUitOldTransmitter = require('../../lib/DeviceKlikAanKlikUitOldTransmitter');

module.exports = class extends DeviceKlikAanKlikUitOldTransmitter {

  async onRFInit() {
    await super.onRFInit();
    this.deviceTimeout = null;
  }

  async onUninit() {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }
    await super.onUninit();
  }

  async onCommandFirst(command) {
    if (!!command.state === true) {
      let timerSetting = Number(this.getSetting('timeout'));
      if (timerSetting <= 100) timerSetting = timerSetting * 60 * 1000;
      if (timerSetting !== 0) {
        if (this.deviceTimeout) {
          this.homey.clearTimeout(this.deviceTimeout);
        }

        this.deviceTimeout = this.homey.setTimeout(() => {
          this.setCapabilityValue('alarm_motion', false).catch(this.error);
        }, timerSetting);
      }
    }

    return this.setCapabilityValue('alarm_motion', !!command.state);
  }

};
