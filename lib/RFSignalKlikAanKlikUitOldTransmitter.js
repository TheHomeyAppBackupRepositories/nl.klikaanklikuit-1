'use strict';

const { RFError, RFUtil } = require('homey-rfdriver');
const RFSignalKlikAanKlikUitOld = require('./RFSignalKlikAanKlikUitOld');

/**
 * 433 Kaku signal description
 *
 * Example payload: 011110011101 (12 bits)
 *
 * 0111    01    11       ...   1
 * address unit  channel        state
 *
 */

module.exports = class extends RFSignalKlikAanKlikUitOld {

  static ID = 'kaku-old-transmitter';

  static payloadToCommand(payload) {
    const address = String(payload.slice(0, 4).join(''));
    const unit = String(payload.slice(4, 6).join(''));
    const channel = String(payload.slice(6, 8).join(''));
    const state = Boolean(payload.slice(11, 12)[0]);
    const group = (unit === '22' && channel === '22');

    return {
      address,
      state,
      channel,
      unit,
      group,
    };
  }

};
