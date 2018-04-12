'use strict';

module.exports = {
  name: 'ember-paypal-button',

  contentFor(type) {
    if (type === 'head') {
      return '<script src="https://www.paypalobjects.com/api/checkout.js"></script>';
    }
  }
};
