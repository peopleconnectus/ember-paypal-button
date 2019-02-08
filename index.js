'use strict';

module.exports = {
  name: 'ember-paypal-button',

  contentFor(type, config) {
    let excludeScript = (config['paypal-button'] || {}).excludeScript;
    if (excludeScript) {
      return;
    }
    if (type === 'head') {
      return '<script src="https://www.paypalobjects.com/api/checkout.js"></script>';
    }
  }
};
