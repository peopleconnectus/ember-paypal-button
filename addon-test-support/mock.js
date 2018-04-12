export default function mock({
  window,
  renderCallback = () => {}
} = {}) {
  window.paypal = {
    Button: {
      render: renderCallback
    }
  };
}

export function reset({
  window
}) {
  delete window.paypal;
}
