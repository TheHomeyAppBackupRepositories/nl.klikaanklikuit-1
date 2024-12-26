'use strict';

const RFSignalKlikAanKlikUitOld = require('./RFSignalKlikAanKlikUitOld');

/**
 * The WST-8700 and WST-8800 transmitters use 6 bits for the address, but only seem to use
 * a single bit for the state, unlike the RFSignalKlikAanKlikUitOld class which uses 2 bits for
 * state. I'm not sure if that's a bug in the old class, but there have been no complaints about
 * devices other than the WST-8700 and WST-8800, so I'm creating a new class for these devices.
 *
 * If it turns out there is a bug in the old class, we can fix it and remove this class and the
 * .homeycompose/signals/433/kaku-wst.json file.
 */
module.exports = class extends RFSignalKlikAanKlikUitOld {

  static ID = 'kaku-wst';

  static payloadToCommand(payload) {
    const address = String(payload.slice(0, 6).join(''));
    const unit = String(payload.slice(6, 8).join(''));
    const channel = String(payload.slice(8, 10).join(''));
    const state = Boolean(payload.slice(11, 12)[0]);

    return {
      address,
      state,
      channel,
      unit,
    };
  }

};
