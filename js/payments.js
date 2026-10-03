// BayaniHub payment gateway bridge.
// Public configuration only contains the Edge Function URL and mode.
// Never place GCash secrets, private keys, or merchant credentials in this file.
window.BayaniPayments = {
  config: {
    mode: 'manual_fallback',
    checkoutEndpoint: '',
    returnPath: 'payment-return.html'
  },

  isAutomaticReady() {
    return this.config.mode === 'gcash_webpay' &&
      /^https:\/\//i.test(String(this.config.checkoutEndpoint || ''));
  },

  returnUrl() {
    return new URL(this.config.returnPath, window.location.href).href;
  },

  async startCheckout(payload) {
    if (!this.isAutomaticReady()) {
      throw new Error('Automatic GCash checkout is not connected yet. Manual GCash remains available.');
    }

    const response = await fetch(this.config.checkoutEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        return_url: this.returnUrl(),
        origin: window.location.origin
      })
    });

    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }

    if (!response.ok) {
      throw new Error(data?.error || data?.message || 'GCash checkout could not be started.');
    }

    const checkoutUrl = String(data?.checkout_url || data?.payment_url || '').trim();
    if (!checkoutUrl || !/^https:\/\//i.test(checkoutUrl)) {
      throw new Error('The payment service did not return a valid checkout URL.');
    }

    window.location.assign(checkoutUrl);
    return data;
  }
};
