import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupRender } from 'ember-test-setup';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import window, { reset } from 'ember-window-mock';
import mock from 'ember-paypal-button/test-support/mock';

module('Integration | Component | paypal-button', function(hooks) {
  setupRenderingTest(hooks);

  let renderSpy;
  let paymentStub;
  let onAuthorizeStub;

  hooks.beforeEach(function() {
    paymentStub = sinon.stub().returns('payment response');
    onAuthorizeStub = sinon.stub().returns('onAuthorize response');

    mock({
      window,
      renderCallback: renderSpy = sinon.spy()
    });

    this.set('isEnabled', true);
  });

  hooks.afterEach(function() {
    reset(window);
  });

  setupRender(hooks, {
    beforeRender() {
      this.setProperties({
        payment: paymentStub,
        onAuthorize: onAuthorizeStub
      });
    },
    template: hbs`
      {{paypal-button
        isEnabled=isEnabled
        class=(if isCreditTabActive "hide")
        payment=(action payment)
        onAuthorize=(action onAuthorize)
      }}
    `
  });

  test('it calls render on paypal global', async function(assert) {
    await this.render();

    assert.ok(renderSpy.calledOnce);
  });

  test('it calls enable on actions when validate callback is called and is enabled', async function(assert) {
    await this.render();

    let { validate } = renderSpy.firstCall.args[0];

    let enableSpy = sinon.spy();
    let disableSpy = sinon.spy();

    validate({
      enable: enableSpy,
      disable: disableSpy
    });

    assert.equal(enableSpy.callCount, 1);
    assert.equal(disableSpy.callCount, 0);
  });

  test('it calls disabled on actions when validate callback is called and is disabled', async function(assert) {
    this.set('isEnabled', false);

    await this.render();

    let { validate } = renderSpy.firstCall.args[0];

    let enableSpy = sinon.spy();
    let disableSpy = sinon.spy();

    validate({
      enable: enableSpy,
      disable: disableSpy
    });

    assert.equal(enableSpy.callCount, 0);
    assert.equal(disableSpy.callCount, 1);
  });

  test('it calls payment action when payment callback is called', async function(assert) {
    await this.render();

    let { payment } = renderSpy.firstCall.args[0];

    let response = payment();

    assert.ok(paymentStub.calledOnce);

    assert.equal(response, 'payment response');
  });

  test('it calls onAuthorize action when onAuthorize callback is called', async function(assert) {
    await this.render();

    let { onAuthorize } = renderSpy.firstCall.args[0];

    let response = onAuthorize();

    assert.ok(onAuthorizeStub.calledOnce);

    assert.equal(response, 'onAuthorize response');
  });

  test('it does not error if the paypal script does not load', async function(assert) {
    assert.expect(0);
    window.paypal = null;

    await this.render();
  });

  test('it calls PayPal API to set button state when isEnabled changes', async function(assert) {
    await this.render();

    let { validate } = renderSpy.firstCall.args[0];

    let enableSpy = sinon.spy();
    let disableSpy = sinon.spy();

    validate({
      enable: enableSpy,
      disable: disableSpy
    });

    enableSpy.resetHistory();
    disableSpy.resetHistory();

    this.set('isEnabled', false);

    assert.equal(enableSpy.callCount, 0);
    assert.equal(disableSpy.callCount, 1);

    enableSpy.resetHistory();
    disableSpy.resetHistory();

    this.set('isEnabled', true);

    assert.equal(enableSpy.callCount, 1);
    assert.equal(disableSpy.callCount, 0);
  });

  test('it does not throw if PayPal is not loaded', async function(assert) {
    assert.expect(0);

    window.paypal = null;

    await this.render();

    this.set('isEnabled', false);
  });

  test('it does not throw if PayPal actions object is not present', async function(assert) {
    assert.expect(0);

    await this.render();

    this.set('isEnabled', false);
  });
});
