ember-paypal-button
==============================================================================

[![npm version](https://badge.fury.io/js/ember-paypal-button.svg)](https://badge.fury.io/js/ember-paypal-button)
[![Build Status](https://travis-ci.org/peopleconnectus/ember-paypal-button.svg?branch=master)](https://travis-ci.org/peopleconnectus/ember-paypal-button)

Ember wrapper for the PayPal button

https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/server-side-REST-integration/

Installation
------------------------------------------------------------------------------

```
ember install ember-paypal-button
```


Usage
------------------------------------------------------------------------------

```js
let ENV = {
  'paypal-button': {
    env: 'your custom paypal environment'
  }
};
```

```hbs
{{paypal-button
  isEnabled=isEnabled
  payment=(action payment)
  onAuthorize=(action onAuthorize)
  onCancel=(action onCancel)
  onError=(action onError)
}}
```

This comes with a test helper to mock the paypal window object.

```js
import mock, { reset } from 'ember-paypal-button/test-support/mock';

mock();
reset();

// or

mock({
  // optional custom window mock
  window,

  // optional render callback
  render
});

reset({
  // optional custom window mock
  window
})
```


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-paypal-button`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
