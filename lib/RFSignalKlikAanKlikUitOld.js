'use strict';

const { RFError, RFUtil } = require('homey-rfdriver');
const RFSignalKlikAanKlikUit = require('./RFSignalKlikAanKlikUit');

/**
 * 433 Kaku signal description
 *
 * Example payload: 011110011101 (12 bits)
 *
 * 011110    01    11       01
 * address   unit  channel  state
 *
 */

module.exports = class extends RFSignalKlikAanKlikUit {

  static ID = 'kaku-old';
  static undef = '011';

  /**
   * Helper function to parse the codewheels from the pairing wizard to device data.
   * @param {*} codewheelIndexes
   */
  static codewheelsToCommand(codewheelIndexes) {
    if (codewheelIndexes.length === 2) {
      const address = codewheelIndexes[0]
        .toString(2)
        .padStart(4, 0)
        .split('')
        .reverse()
        .join('');

      const unitWithChannel = codewheelIndexes[1]
        .toString(2)
        .padStart(4, 0)
        .split('')
        .reverse()
        .join('');

      return {
        address,
        state: true,
        channel: unitWithChannel.substr(2, 2),
        unit: unitWithChannel.substr(0, 2),
        undef: this.undef,
      };
    }

    if (codewheelIndexes.length === 1) {
      return {
        address: Math.floor(codewheelIndexes[0] / 3)
          .toString(2)
          .padStart(4, 0)
          .split('')
          .reverse()
          .join(''),
        state: true,
        channel: '00',
        unit: Math.floor(codewheelIndexes[0] % 3)
          .toString(2)
          .padStart(2, 0)
          .split('')
          .reverse()
          .join(''),
        undef: this.undef,
      };
    }

    return null;
  }

  static commandToPayload({
    address,
    state,
    channel,
    unit,
    undef,
  }) {
    if (typeof address !== 'string') {
      throw new RFError(`Invalid Address: ${address}`);
    }

    if (typeof state !== 'boolean') {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof channel !== 'string' || channel.length !== 2) {
      throw new RFError(`Invalid Channel: ${channel}`);
    }

    if (typeof unit !== 'string' || unit.length !== 2) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    if (typeof undef !== 'string' || unit.length !== 3) {
      undef = this.undef;
    }

    if (address.length === 6) {
      return [].concat(
        RFUtil.bitStringToBitArray(address),
        RFUtil.bitStringToBitArray(state ? '01' : '00'),
        RFUtil.bitStringToBitArray(channel),
        RFUtil.bitStringToBitArray(unit),
      );
    } if (address.length === 4) {
      return [].concat(
        RFUtil.bitStringToBitArray(address),
        RFUtil.bitStringToBitArray(unit),
        RFUtil.bitStringToBitArray(channel),
        RFUtil.bitStringToBitArray(undef),
        RFUtil.bitStringToBitArray(state ? '1' : '0'),
      );
    }

    throw new RFError(`Invalid Address Length: ${address}`);
  }

  static payloadToCommand(payload) {
    const address = String(payload.slice(0, 6).join(''));
    const unit = String(payload.slice(6, 8).join(''));
    const channel = String(payload.slice(8, 10).join(''));
    const state = Boolean(payload.slice(10, 12).join(''));

    return {
      address,
      state,
      channel,
      unit,
    };
  }

  static createPairCommand(codewheelIndexes) {
    if (codewheelIndexes && (codewheelIndexes.length === 1 || codewheelIndexes.length === 2)) {
      return this.codewheelsToCommand(codewheelIndexes);
    }

    return {
      address: RFUtil.generateRandomBitString(6),
      state: true,
      channel: RFUtil.generateRandomBitString(2),
      unit: RFUtil.generateRandomBitString(2),
    };
  }

};
