// BayaniHub revenue configuration.
// Secure revenue state lives in Supabase; this file contains only public pricing/rules.
const BayaniRevenue = {
  feePct: 5,
  minDonation: 50,
  postFee: 0,
  paymentMode: 'manual_fallback',
  packages: [
    { id: 'boost_7', name: 'Campaign boost · 7 days', price: 199, days: 7, note: 'Featured campaign placement for 7 days after payment is confirmed.' },
    { id: 'sponsor_7', name: 'Homepage sponsor · 7 days', price: 499, days: 7, note: 'Your brand in the sponsor slot for 7 days after payment is confirmed.' },
    { id: 'sponsor_30', name: 'Homepage sponsor · 30 days', price: 1499, days: 30, note: 'Your brand in the sponsor slot for 30 days after payment is confirmed.' }
  ],
  split(amount) {
    const gross = Math.round(Number(amount) || 0);
    const fee = Math.round(gross * this.feePct / 100);
    return { gross, fee, organizer: Math.max(0, gross - fee), platform: Math.max(0, fee) };
  }
};
