'use strict';

const DeviceKlikAanKlikUitNewReceiver = require('../../lib/DeviceKlikAanKlikUitNewReceiver');

module.exports = class extends DeviceKlikAanKlikUitNewReceiver {

  static CAPABILITIES = {
    async onoff({ value, data }) {
      return {
        ...data,
        state: value,
        group: false,
      };
    },
  };

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

  async onAdded() {
    if (this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', false);
    }
  }

  async onCapability(capabilityId, value) {
    if (capabilityId === 'onoff') {
      this.setOffAfterTimer(value);
    }

    await super.onCapability(capabilityId, value);
  }

  /**
   * Sets the capability when the device is triggered by remote for on off
   *
   * @param onoff
   * @returns {Promise<void>}
   */
  async onCommandFirst({ state }) {
    if (this.hasCapability('onoff')) {
      this.setCapabilityValue('onoff', state)
        .catch(this.error);

      this.setOffAfterTimer(state);
    }
  }

  setOffAfterTimer(value) {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }

    const timerSetting = this.getSetting('timeout');
    // Only use the 'timer' functionality is the value === true
    if (value === true && timerSetting !== '0') {
      this.deviceTimeout = this.homey.setTimeout(() => {
        this.setCapabilityValue('onoff', false)
          .catch(this.error);
      }, Number(timerSetting));
    }
  }

};
