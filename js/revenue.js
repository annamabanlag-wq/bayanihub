// BayaniHub revenue: confirmed donation fee + advertising/sponsor payments only. Help requests are free. Manual GCash is confirmed by staff before revenue is recorded.
const BayaniRevenue = {
  feePct: 5,
  minDonation: 50,
  postFee: 0,
  gcash: '09381447214',
  packages: [
    { id: 'boost_7', name: 'Campaign boost · 7 days', price: 199, days: 7, note: 'Urgent badge and top of Discover for 7 days after payment is confirmed.' },
    { id: 'sponsor_7', name: 'Homepage sponsor · 7 days', price: 499, days: 7, note: 'Your name in the sponsor slot for 7 days.' },
    { id: 'sponsor_30', name: 'Homepage sponsor · 30 days', price: 1499, days: 30, note: 'Your name in the sponsor slot for 30 days.' }
  ],
  split(amount, tip) {
    const gross = Math.round(Number(amount) || 0);
    const extra = Math.max(0, Math.round(Number(tip) || 0));
    const fee = Math.round(gross * this.feePct / 100);
    return { gross, fee, organizer: Math.max(0, gross - fee), tip: extra, platform: fee + extra };
  },
  ledger() {
    return JSON.parse(localStorage.getItem('bayani_ledger') || '[]');
  },
  addLedger(row) {
    const list = this.ledger();
    list.unshift(row);
    localStorage.setItem('bayani_ledger', JSON.stringify(list));
  },
  saveLedger(list) {
    localStorage.setItem('bayani_ledger', JSON.stringify(list));
  },
  totals() {
    const rows = this.ledger().filter(r => r.status === 'confirmed');
    return {
      platform: rows.reduce((s, r) => s + Number(r.platform || 0), 0),
      organizer: rows.reduce((s, r) => s + Number(r.organizer || 0), 0),
      sponsors: rows.filter(r => r.kind === 'sponsor').reduce((s, r) => s + Number(r.platform || 0), 0),
      count: rows.length
    };
  }
};
