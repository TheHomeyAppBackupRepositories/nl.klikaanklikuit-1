'use strict';

const { RFUtil } = require('homey-rfdriver');
const DriverKlikAanKlikUitOld = require('./DriverKlikAanKlikUitOld');

module.exports = class extends DriverKlikAanKlikUitOld {

  /**
   * @returns {Promise<void>}
   */
  async onRFInit() {
    this.codewheels = [];
    super.onRFInit();
  }

  async onPair(session) {
    const signal = await this.getRFSignal();
    let command = '0000';

    session.setHandler('set_device_codewheels', async data => {
      command = signal.constructor.createPairCommand(data);
    });

    session.setHandler('tx', async () => {
      await signal.constructor.commandToDeviceData(command);
    });

    session.setHandler('createDevice', async () => {
      const name = (this.manifest && this.manifest.name) ? this.homey.__(this.manifest.name) : this.id;

      return {
        name,
        data: {
          uuid: RFUtil.generateUUIDv4(),
          ...signal.constructor.commandToDeviceData(command),
        },
      };
    });
  }

};
