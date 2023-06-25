'use strict';

const DeviceKlikAanKlikUitNewReceiver = require('../../lib/DeviceKlikAanKlikUitNewReceiver');

module.exports = class extends DeviceKlikAanKlikUitNewReceiver {

  static CAPABILITIES = {
    onoff: ({ value, data }) => ({
      ...data,
      state: !!value,
      group: false,
    }),
    async windowcoverings_state({ value, data }) {
      let coveringState;
      switch (this.lastState) {
        case 'up':
          if (value === 'up' || value === 'idle') {
            coveringState = true;
          }
          if (value === 'down') {
            coveringState = false;
          }
          break;
        case 'idle':
          if (value === 'up') {
            coveringState = true;
          }
          if (value === 'idle') {
            if (this.lastTransitionState === 'up') {
              coveringState = true;
            }
            if (this.lastTransitionState === 'down') {
              coveringState = false;
            }
          }
          if (value === 'down') {
            coveringState = false;
          }
          break;
        case 'down':
          if (value === 'up') {
            coveringState = true;
          }
          if (value === 'idle' || value === 'down') {
            coveringState = false;
          }
          break;
        default:
          coveringState = true;
      }

      // Store the last set value
      this.lastState = value;

      // Rotate the up/down
      if (coveringState !== 'idle' && this.getSetting('rotated') === '180') {
        coveringState = !coveringState;
      }

      return {
        ...data,
        state: coveringState,
        group: false,
      };
    },
  };

  async onRFInit() {
    await super.onRFInit();
    this.deviceTimeout = null;
    this.lastTransitionState = null; // a change to up or down
    this.lastState = 'idle';
  }

  async onUninit() {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }
    await super.onUninit();
  }

  async onAdded() {
    if (this.hasCapability('windowcoverings_state')) {
      await this.setCapabilityValue('windowcoverings_state', 'down');
    }
  }

  async onCapability(capabilityId, value) {
    if (capabilityId === 'windowcoverings_state') {
      if (this.deviceTimeout) {
        this.homey.clearTimeout(this.deviceTimeout);
      }

      // Prevent multiple presses on the idle button when there was no previous up or down state
      if (value === 'idle' && !this.lastTransitionState) {
        return;
      }

      if (value !== 'idle') {
        this.lastTransitionState = value;
        // 2 minutes reset, corresponding to KAKU manual.
        this.deviceTimeout = this.homey.setTimeout(() => {
          this.lastState = 'idle';
          this.setCapabilityValue('windowcoverings_state', 'idle')
            .catch(this.log);
        }, 120000);
      }
    }

    await super.onCapability(capabilityId, value);
  }

};
