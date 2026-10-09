// BayaniHub seed data & storage helpers
const CATEGORIES = [
  { id: 'all', label: 'All', icon: '', color: 'bg-teal-600 text-white' },
  { id: 'medical', label: 'Medical', icon: '🏥', color: 'bg-rose-100 text-rose-700' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧', color: 'bg-blue-100 text-blue-700' },
  { id: 'children', label: 'Children', icon: '👶', color: 'bg-amber-100 text-amber-700' },
  { id: 'elderly', label: 'Elderly', icon: '👴', color: 'bg-orange-100 text-orange-700' },
  { id: 'disability', label: 'Disability', icon: '♿', color: 'bg-purple-100 text-purple-700' },
  { id: 'pet', label: 'Pet Assistance', icon: '🐾', color: 'bg-amber-100 text-amber-700' },
  { id: 'education', label: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'community', label: 'Community', icon: '🏘️', color: 'bg-teal-100 text-teal-700' }
];

const SEED_CAMPAIGNS = [
  {
    id: 'raul-hospital',
    title: 'Help Raul Family for his Hospital Bill',
    category: 'medical',
    story: 'Raul and his family need help covering his hospital bill in Gma, Cavite. Every contribution brings hope for his recovery.',
    goal: 300000,
    raised: 0,
    donors: 0,
    image: 'assets/campaign-raul.jpg',
    organizer: 'Raul Family',
    location: 'Gma Cavite',
    verified: true,
    status: 'approved',
    urgent: true,
    created: '2026-10-09',
    gcash: '',
    evidence: [],
    sample: false
  },
  {
    id: 'mother-hospital',
    title: 'Help my mother for her hospital bill',
    category: 'medical',
    story: 'My mother needs urgent help with her hospital bills. We are from Pasig City and any support will go a long way.',
    goal: 2000000,
    raised: 0,
    donors: 0,
    image: 'assets/campaign-mother.jpg',
    organizer: 'Family Member',
    location: '67 ayoro st, xandroville, centennial 2, nagpayong pinagnuhatan pasig city.',
    verified: true,
    status: 'approved',
    urgent: true,
    created: '2026-10-07',
    gcash: '',
    evidence: [],
    sample: false
  },
  {
    id: 'elderly-support',
    title: 'Help elderly in need',
    category: 'elderly',
    story: 'Supporting an elderly Filipino who needs assistance for basic needs and care.',
    goal: 150000,
    raised: 0,
    donors: 0,
    image: 'assets/campaign-elderly.jpg',
    organizer: 'Community',
    location: 'Philippines',
    verified: true,
    status: 'approved',
    urgent: false,
    created: '2026-10-08',
    gcash: '',
    evidence: [],
    sample: false
  }
];

const BayaniStorage = {
  getCampaigns() {
    const stored = localStorage.getItem('bayani_campaigns');
    if (!stored) {
      localStorage.setItem('bayani_campaigns', JSON.stringify(SEED_CAMPAIGNS));
      return [...SEED_CAMPAIGNS];
    }
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [...SEED_CAMPAIGNS];
    } catch (_) {
      localStorage.setItem('bayani_campaigns', JSON.stringify(SEED_CAMPAIGNS));
      return [...SEED_CAMPAIGNS];
    }
  },
  saveCampaigns(list) {
    localStorage.setItem('bayani_campaigns', JSON.stringify(list));
  },
  getPending() {
    try {
      const parsed = JSON.parse(localStorage.getItem('bayani_pending') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  },
  savePending(list) {
    localStorage.setItem('bayani_pending', JSON.stringify(list));
  },
  getDonations() {
    try {
      const parsed = JSON.parse(localStorage.getItem('bayani_donations') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  },
  addDonation(d) {
    const list = this.getDonations();
    list.unshift(d);
    localStorage.setItem('bayani_donations', JSON.stringify(list));
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('bayani_user') || 'null'); }
    catch (_) { return null; }
  },
  setUser(u) {
    localStorage.setItem('bayani_user', JSON.stringify(u));
  },
  isAdmin() {
    return localStorage.getItem('bayani_admin') === 'true';
  },
  setAdmin(v) {
    localStorage.setItem('bayani_admin', v ? 'true' : 'false');
  }
};

function formatPeso(n) {
  const value = Number(n);
  return '₱' + (Number.isFinite(value) ? value : 0).toLocaleString('en-PH');
}

function percent(raised, goal) {
  const r = Number(raised) || 0;
  const g = Number(goal) || 0;
  if (g <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((r / g) * 100)));
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const days = Math.floor((now - d) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}
