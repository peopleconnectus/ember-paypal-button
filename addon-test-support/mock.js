export default function mock({
  window = window,
  render = () => {}
} = {}) {
  window.paypal = {
    Button: {
      render
    }
  };
}

export function reset({
  window = window
}) {
  delete window.paypal;
}
