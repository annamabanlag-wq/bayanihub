// BayaniHub seed data & storage helpers
const CATEGORIES = [
  { id: 'medical', label: 'Medical', icon: '🏥', color: 'bg-red-100 text-red-700' },
  { id: 'disability', label: 'Disability', icon: '♿', color: 'bg-purple-100 text-purple-700' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧', color: 'bg-blue-100 text-blue-700' },
  { id: 'bereavement', label: 'Bereavement', icon: '🕊️', color: 'bg-gray-100 text-gray-700' },
  { id: 'pet', label: 'Pet Assistance', icon: '🐾', color: 'bg-amber-100 text-amber-700' },
  { id: 'education', label: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'environment', label: 'Environment', icon: '🌱', color: 'bg-green-100 text-green-700' },
  { id: 'community', label: 'Community', icon: '🏘️', color: 'bg-teal-100 text-teal-700' },
  { id: 'hospital', label: 'Hospital', icon: '🏨', color: 'bg-rose-100 text-rose-700' }
];

const SEED_CAMPAIGNS = [
  {
    id: 'c1',
    title: 'Help little Ana fight leukemia',
    category: 'medical',
    story: 'Ana is 7 years old from Cebu. She was diagnosed with acute lymphoblastic leukemia. Her parents have already spent their savings on initial chemo. They need funds for continued treatment, medicines, and hospital stays. Every peso helps keep Ana fighting.',
    goal: 250000,
    raised: 187500,
    donors: 142,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    organizer: 'Maria Santos',
    location: 'Cebu City',
    verified: true,
    status: 'approved',
    urgent: true,
    created: '2026-09-10',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c2',
    title: 'Wheelchair & therapy for Mang Jose',
    category: 'disability',
    story: 'Mang Jose, 58, suffered a stroke that left him partially paralyzed. He needs a quality wheelchair and ongoing physical therapy so he can regain independence and help his family again.',
    goal: 85000,
    raised: 62000,
    donors: 89,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3b5c4?w=600&h=400&fit=crop',
    organizer: 'Elena Reyes',
    location: 'Quezon City',
    verified: true,
    status: 'approved',
    urgent: false,
    created: '2026-09-05',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c3',
    title: 'Surgery for our beloved aspin Max',
    category: 'pet',
    story: 'Max, a 4-year-old aspin, was hit by a motorcycle. He needs emergency surgery for a broken leg and internal injuries. Our family loves him like a child. Please help us save Max.',
    goal: 45000,
    raised: 31200,
    donors: 67,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    organizer: 'Carlo Mendoza',
    location: 'Davao City',
    verified: true,
    status: 'approved',
    urgent: true,
    created: '2026-09-18',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c4',
    title: 'College tuition for scholar Jun',
    category: 'education',
    story: 'Jun is a top student from a public high school in Leyte. He got accepted to a state university but cannot afford tuition, books, and boarding. Help him become the first college graduate in his family.',
    goal: 60000,
    raised: 28500,
    donors: 54,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
    organizer: 'Teacher Ana Cruz',
    location: 'Tacloban',
    verified: true,
    status: 'approved',
    urgent: false,
    created: '2026-08-28',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c5',
    title: 'Funeral & support for family of OFW',
    category: 'bereavement',
    story: 'Kuya Rico, an OFW, passed away suddenly abroad. His wife and two young children need help with repatriation, funeral expenses, and immediate living support while they adjust.',
    goal: 120000,
    raised: 94500,
    donors: 203,
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fbaafb2f?w=600&h=400&fit=crop',
    organizer: 'Community Volunteers',
    location: 'Pampanga',
    verified: true,
    status: 'approved',
    urgent: true,
    created: '2026-09-12',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c6',
    title: 'Rebuild classroom after typhoon',
    category: 'community',
    story: 'A strong typhoon damaged the only elementary school in our barangay. 120 kids currently study under tarps. We need materials and labor to rebuild safe classrooms before the rainy season worsens.',
    goal: 350000,
    raised: 128000,
    donors: 176,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop',
    organizer: 'Barangay Education Committee',
    location: 'Eastern Samar',
    verified: true,
    status: 'approved',
    urgent: false,
    created: '2026-09-01',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c7',
    title: 'Dialysis support for Nanay Lita',
    category: 'hospital',
    story: 'Nanay Lita has end-stage renal disease. She needs thrice-weekly dialysis. Her children pool money every month but rising costs are making it impossible. Help keep Nanay alive and with her grandchildren.',
    goal: 180000,
    raised: 156000,
    donors: 118,
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop',
    organizer: 'Family of Lita Ramos',
    location: 'Iloilo City',
    verified: true,
    status: 'approved',
    urgent: true,
    created: '2026-09-08',
    gcash: '09381447214',
    evidence: []
  },
  {
    id: 'c8',
    title: 'Mangrove restoration – coastal protection',
    category: 'environment',
    story: 'Our coastal community lost most of its mangrove cover. We are planting 5,000 seedlings and need funds for seedlings, tools, and community training so future storms cause less damage.',
    goal: 95000,
    raised: 41000,
    donors: 72,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    organizer: 'Youth Eco Warriors',
    location: 'Palawan',
    verified: true,
    status: 'approved',
    urgent: false,
    created: '2026-09-15',
    gcash: '09381447214',
    evidence: []
  }
];

// Storage helpers
const Storage = {
  getCampaigns() {
    const stored = localStorage.getItem('bayani_campaigns');
    if (!stored) {
      localStorage.setItem('bayani_campaigns', JSON.stringify(SEED_CAMPAIGNS));
      return [...SEED_CAMPAIGNS];
    }
    return JSON.parse(stored);
  },
  saveCampaigns(list) {
    localStorage.setItem('bayani_campaigns', JSON.stringify(list));
  },
  getPending() {
    return JSON.parse(localStorage.getItem('bayani_pending') || '[]');
  },
  savePending(list) {
    localStorage.setItem('bayani_pending', JSON.stringify(list));
  },
  getDonations() {
    return JSON.parse(localStorage.getItem('bayani_donations') || '[]');
  },
  addDonation(d) {
    const list = this.getDonations();
    list.unshift(d);
    localStorage.setItem('bayani_donations', JSON.stringify(list));
  },
  getUser() {
    return JSON.parse(localStorage.getItem('bayani_user') || 'null');
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
  return '₱' + Number(n).toLocaleString('en-PH');
}

function percent(raised, goal) {
  return Math.min(100, Math.round((raised / goal) * 100));
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
