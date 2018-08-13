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
  let onCancelStub;
  let onErrorStub;

  hooks.beforeEach(function() {
    paymentStub = sinon.stub().returns('payment response');
    onAuthorizeStub = sinon.stub().returns('onAuthorize response');
    onCancelStub = sinon.stub().returns('onCancel response');
    onErrorStub = sinon.stub().returns('onError response');

    mock({
      window,
      render: renderSpy = sinon.spy()
    });

    this.set('isEnabled', true);
  });

  hooks.afterEach(function() {
    reset(window);
  });

  let render = setupRender(hooks, {
    beforeRender() {
      this.setProperties({
        payment: paymentStub,
        onAuthorize: onAuthorizeStub,
        onCancel: onCancelStub,
        onError: onErrorStub
      });
    },
    template: hbs`
      {{paypal-button
        isEnabled=isEnabled
        class=(if isCreditTabActive "hide")
        payment=(action payment)
        onAuthorize=(action onAuthorize)
        onCancel=(action onCancel)
        onError=(action onError)
      }}
    `
  });

  test('it calls render on paypal global', async function(assert) {
    await render();

    assert.ok(renderSpy.calledOnce);
  });

  test('it calls enable on actions when validate callback is called and is enabled', async function(assert) {
    await render();

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

    await render();

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
    await render();

    let { payment } = renderSpy.firstCall.args[0];

    let response = payment();

    assert.ok(paymentStub.calledOnce);

    assert.equal(response, 'payment response');
  });

  test('it calls onAuthorize action when onAuthorize callback is called', async function(assert) {
    await render();

    let { onAuthorize } = renderSpy.firstCall.args[0];

    let response = onAuthorize();

    assert.ok(onAuthorizeStub.calledOnce);

    assert.equal(response, 'onAuthorize response');
  });

  test('it calls onCancel action when onCancel callback is called', async function(assert) {
    await render();

    let { onCancel } = renderSpy.firstCall.args[0];

    let response = onCancel();

    assert.ok(onCancelStub.calledOnce);

    assert.equal(response, 'onCancel response');
  });

  test('it calls onError action when onError callback is called', async function(assert) {
    await render();

    let { onError } = renderSpy.firstCall.args[0];

    let response = onError();

    assert.ok(onErrorStub.calledOnce);

    assert.equal(response, 'onError response');
  });


  test('it does not error if the paypal script does not load', async function(assert) {
    assert.expect(0);
    window.paypal = null;

    await render();
  });

  test('it calls PayPal API to set button state when isEnabled changes', async function(assert) {
    await render();

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

    await render();

    this.set('isEnabled', false);
  });

  test('it does not throw if PayPal actions object is not present', async function(assert) {
    assert.expect(0);

    await render();

    this.set('isEnabled', false);
  });
});
