// BayaniHub main discovery logic
let activeCategory = null;
let searchQuery = '';
let sortBy = 'recent';
const CAMPAIGN_FALLBACK_IMAGES = {
  medical: 'assets/campaign-raul.jpg',
  hospital: 'assets/campaign-mother.jpg',
  elderly: 'assets/campaign-elderly.jpg',
  children: 'assets/campaign-raul.jpg',
  family: 'assets/campaign-mother.jpg',
  default: 'assets/bayanihub-cover.svg'
};

function getCampaignFallbackImage(category, campaign) {
  const key = String(category || '').toLowerCase().trim();
  return CAMPAIGN_FALLBACK_IMAGES[key] || CAMPAIGN_FALLBACK_IMAGES.default;
}

function isCampaignPlaceholderImage(value) {
  const image = String(value || '').trim().toLowerCase();
  return !image || image.includes('placeholder') || image.includes('unsplash') || image.includes('pexels');
}

function bayaniEsc(value) {
  return String(value ?? '').replace(/[&<>\"']/g, ch => ({
    '&':'&', '<':'<', '>':'>', '\"':'"', "'":'&#039;'
  }[ch]));
}

function bayaniSafeImage(value) {
  const fallback = 'assets/bayanihub-cover.svg';
  try {
    const u = new URL(String(value || ''), location.href);
    if (u.protocol === 'http:' || u.protocol === 'https:') return bayaniEsc(u.href);
  } catch (_) {}
  return String(value || fallback);
}

document.addEventListener('DOMContentLoaded', async () => {
  renderCategories();
  renderCampaigns();
  updateStats();
  bindEvents();
  initRevealAnimations();
  if (window.BayaniCloud) {
    try {
      await BayaniCloud.syncCampaigns();
      renderCategories();
      renderCampaigns();
      updateStats();
    } catch (err) {
      console.warn('Cloud sync failed; using local data.', err);
    }
  }
});

function bindEvents() {
  document.getElementById('btn-search-toggle')?.addEventListener('click', () => {
    const bar = document.getElementById('search-bar');
    bar.classList.toggle('hidden');
    if (!bar.classList.contains('hidden')) {
      document.getElementById('search-input').focus();
    }
  });

  document.getElementById('search-input')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCampaigns();
  });

  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderCampaigns();
  });

  document.getElementById('btn-menu')?.addEventListener('click', openMenu);
  document.getElementById('btn-clear-filters')?.addEventListener('click', clearFilters);
}

function openMenu() {
  document.getElementById('menu-overlay').classList.remove('hidden');
  document.getElementById('side-menu').classList.remove('translate-x-full');
}
function closeMenu() {
  document.getElementById('menu-overlay').classList.add('hidden');
  document.getElementById('side-menu').classList.add('translate-x-full');
}

function renderCategories() {
  const container = document.getElementById('category-scroll');
  if (!container) return;
  const displayCats = [
    { id: null, label: 'All', icon: '' },
    ...CATEGORIES.filter(c => ['medical','family','children','elderly'].includes(c.id))
  ];
  container.innerHTML = displayCats.map(c => {
    const isActive = (c.id === null && activeCategory === null) || activeCategory === c.id;
    const idAttr = c.id === null ? '' : bayaniEsc(c.id);
    const label = bayaniEsc(c.label);
    const icon = c.icon ? bayaniEsc(c.icon) + ' ' : '';
    return `
      <button data-cat="${idAttr}"
        class="cat-btn flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition
          ${isActive ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'}">
        ${icon}${label}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cat || null;
      activeCategory = (id && activeCategory === id) ? null : id;
      renderCategories();
      renderCampaigns();
    });
  });
}

function clearFilters() {
  activeCategory = null;
  searchQuery = '';
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  renderCategories();
  renderCampaigns();
}

function getFiltered() {
  let list = BayaniStorage.getCampaigns().filter(c => c.status === 'approved');

  if (activeCategory) list = list.filter(c => c.category === activeCategory);
  if (searchQuery) {
    list = list.filter(c =>
      String(c.title || '').toLowerCase().includes(searchQuery) ||
      String(c.story || '').toLowerCase().includes(searchQuery) ||
      String(c.organizer || '').toLowerCase().includes(searchQuery) ||
      String(c.location || '').toLowerCase().includes(searchQuery)
    );
  }

  switch (sortBy) {
    case 'urgent':
      list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || (Number(b.raised) / Math.max(1, Number(b.goal))) - (Number(a.raised) / Math.max(1, Number(a.goal))));
      break;
    case 'progress':
      list.sort((a, b) => (Number(b.raised) / Math.max(1, Number(b.goal))) - (Number(a.raised) / Math.max(1, Number(a.goal))));
      break;
    case 'raised':
      list.sort((a, b) => Number(b.raised || 0) - Number(a.raised || 0));
      break;
    default:
      list.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
  }
  return list;
}

function renderCampaigns() {
  const list = getFiltered();
  const container = document.getElementById('campaign-list');
  const empty = document.getElementById('empty-state');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  container.innerHTML = list.map((c, index) => {
    const pct = percent(c.raised, c.goal);
    const cat = CATEGORIES.find(x => x.id === c.category) || { label: c.category, icon: '📌', color: 'bg-gray-100 text-gray-700' };
    const title = bayaniEsc(c.title);
    const location = bayaniEsc(c.location);
    const image = bayaniSafeImage(c.image || getCampaignFallbackImage(c.category, c));
    const catLabel = bayaniEsc(cat.label);
    const catIcon = bayaniEsc(cat.icon || '');
    const created = bayaniEsc(c.created);

    return `
    <article style="animation-delay:${Math.min(index * 70, 420)}ms" class="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in cursor-pointer" onclick="location.href='campaign.html?id=${encodeURIComponent(c.id)}'">
      <div class="relative isolate overflow-hidden">
        <img src="${image}" alt="${title}" class="w-full h-48 object-cover" loading="lazy">
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></div>
        <span class="absolute top-3 left-3 ${cat.color} text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">${catIcon} ${catLabel}</span>
        <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow" onclick="event.stopPropagation()">
          <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
        </button>
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 class="font-extrabold text-lg leading-tight line-clamp-2">${title}</h3>
          <p class="mt-1 flex items-center gap-1 text-xs text-white/90"><span>📍</span><span class="line-clamp-1">${location}</span></p>
        </div>
      </div>
      <div class="p-4">
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold text-teal-700">${formatPeso(c.raised)}</span>
          <span class="text-gray-500">of ${formatPeso(c.goal)}</span>
        </div>
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div class="progress-bar h-full bg-teal-500 rounded-full" style="width:${pct}%"></div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>👥 ${Number(c.donors || 0)} donors</span>
          <span>${pct}% funded • ${timeAgo(created)}</span>
        </div>
      </div>
    </article>`;
  }).join('');
}

function updateStats() {
  const list = BayaniStorage.getCampaigns().filter(c => c.status === 'approved' && c.sample !== true);
  const raised = list.reduce((s, c) => s + Number(c.raised || 0), 0);
  const donors = list.reduce((s, c) => s + Number(c.donors || 0), 0);
  const elR = document.getElementById('stat-raised');
  const elC = document.getElementById('stat-campaigns');
  const elD = document.getElementById('stat-donors');
  if (elR) elR.textContent = formatPeso(raised);
  if (elC) elC.textContent = list.length;
  if (elD) elD.textContent = donors;
}

function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
}
