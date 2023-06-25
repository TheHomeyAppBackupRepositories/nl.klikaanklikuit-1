'use strict';

const DeviceKlikAanKlikUitNewReceiver = require('../../lib/DeviceKlikAanKlikUitNewReceiver');

module.exports = class extends DeviceKlikAanKlikUitNewReceiver {

  async onRFInit() {
    await super.onRFInit();

    // Because the doorbell has no state within Homey, there is no need to sync it
    if (this.getData().copiedFromRemote === true) {
      await this.driver.disableRX(this.onRX);
    }
  }

};
