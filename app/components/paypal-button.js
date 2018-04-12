import Component from '@ember/component';
import { run } from '@ember/runloop';
import config from '../config/environment';
import window from 'ember-window-mock';

const {
  env
} = config['paypal-button'];

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    let actions = this.get('paypalActions');
    if (!actions) {
      return;
    }

    this.updateButtonState(actions);
  },

  didInsertElement() {
    this._super(...arguments);

    try {
      this.renderPaypal();
    } catch (error) {
      // Paypal script did not load or errored on render
    }
  },

  renderPaypal() {
    let { paypal } = window;

    // This leaks: https://github.com/krakenjs/xcomponent/issues/116
    paypal.Button.render({
      env,
      commit: true, // Show a 'Pay Now' button
      style: {
        shape: 'rect',
        size: 'responsive'
      },

      validate: actions => {
        run(() => {
          this.set('paypalActions', actions);
          this.updateButtonState(actions);
        });
      },

      payment: () => {
        return run(() => {
          return this.get('payment')();
        });
      },

      onAuthorize: () => { // (data, actions)
        return run(() => {
          return this.get('onAuthorize')();
        });
      }
    }, this.elementId);
  },

  updateButtonState(actions) {
    if (this.get('isEnabled')) {
      actions.enable();
    } else {
      actions.disable();
    }
  }
});
