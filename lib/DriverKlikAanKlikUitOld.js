'use strict';

const { RFDriver } = require('homey-rfdriver');
const RFSignalKlikAanKlikUitOld = require('./RFSignalKlikAanKlikUitOld');

module.exports = class extends RFDriver {

  static SIGNAL = RFSignalKlikAanKlikUitOld;

  async onPair(session) {
    session.setHandler('set_device_codewheels', async data => {
      this.codewheels = data;
    });

    return super.onPair(session);
  }

};
