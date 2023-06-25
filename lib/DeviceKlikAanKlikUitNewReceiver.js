'use strict';

const DeviceKlikAanKlikUitNew = require('./DeviceKlikAanKlikUitNew');

module.exports = class extends DeviceKlikAanKlikUitNew {

  static CAPABILITIES = {
    onoff: ({ value, data }) => ({
      ...data,
      state: !!value,
      group: false,
    }),
  };

  async onAdded() {
    if (this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', false);
    }
  }

  async txOn() {
    await this.driver.tx({
      ...this.getData(),
      group: false,
      state: true,
    }, { device: this });
  }

  async txOff() {
    await this.driver.tx({
      ...this.getData(),
      group: false,
      state: false,
    }, { device: this });
  }

  /**
   * If the device was copied from remote, this is used to match the signal
   *
   * @param command
   * @returns {Promise<boolean>}
   */
  async onCommandMatch(command) {
    if (command === undefined || command === null) {
      return false;
    }

    const { address, unit, channel } = this.getData();

    // If the group is switched, only check is the address matches
    if (command.group) {
      return address === command.address;
    }
    return address === command.address && unit === command.unit && channel === command.channel;
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
    }
  }

};
