// BayaniHub main discovery logic
let activeCategory = null;
let searchQuery = '';
let sortBy = 'recent';

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderCampaigns();
  updateStats();
  bindEvents();
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
  container.innerHTML = CATEGORIES.map(c => `
    <button data-cat="${c.id}" 
      class="cat-btn flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition
        ${activeCategory === c.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'}">
      <span>${c.icon}</span> ${c.label}
    </button>
  `).join('');

  container.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cat;
      activeCategory = activeCategory === id ? null : id;
      renderCategories();
      renderCampaigns();
      document.getElementById('btn-clear-filters').classList.toggle('hidden', !activeCategory && !searchQuery);
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
  document.getElementById('btn-clear-filters')?.classList.add('hidden');
}

function getFiltered() {
  let list = Storage.getCampaigns().filter(c => c.status === 'approved');

  if (activeCategory) list = list.filter(c => c.category === activeCategory);
  if (searchQuery) {
    list = list.filter(c =>
      c.title.toLowerCase().includes(searchQuery) ||
      c.story.toLowerCase().includes(searchQuery) ||
      c.organizer.toLowerCase().includes(searchQuery) ||
      c.location.toLowerCase().includes(searchQuery)
    );
  }

  switch (sortBy) {
    case 'urgent':
      list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || (b.raised / b.goal) - (a.raised / a.goal));
      break;
    case 'progress':
      list.sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
      break;
    case 'raised':
      list.sort((a, b) => b.raised - a.raised);
      break;
    default:
      list.sort((a, b) => new Date(b.created) - new Date(a.created));
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

  container.innerHTML = list.map(c => {
    const pct = percent(c.raised, c.goal);
    const cat = CATEGORIES.find(x => x.id === c.category) || { label: c.category, icon: '📌', color: 'bg-gray-100 text-gray-700' };
    return `
    <article class="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in" onclick="location.href='campaign.html?id=${c.id}'">
      <div class="relative">
        <img src="${c.image}" alt="" class="w-full h-40 object-cover" loading="lazy" onerror="this.src='https://placehold.co/600x400/0d9488/white?text=BayaniHub'">
        ${c.urgent ? '<span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">URGENT</span>' : ''}
        ${c.verified ? '<span class="absolute top-2 right-2 badge-verified text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">✓ Verified</span>' : ''}
      </div>
      <div class="p-4">
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color}">${cat.icon} ${cat.label}</span>
          <span class="text-[10px] text-gray-400">• ${c.location}</span>
        </div>
        <h3 class="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-2">${c.title}</h3>
        <div class="mb-2">
          <div class="flex justify-between text-xs mb-1">
            <span class="font-semibold text-brand-700">${formatPeso(c.raised)}</span>
            <span class="text-gray-500">of ${formatPeso(c.goal)}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="progress-bar h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>${c.donors} donors</span>
          <span>${pct}% funded • ${timeAgo(c.created)}</span>
        </div>
      </div>
    </article>`;
  }).join('');
}

function updateStats() {
  const list = Storage.getCampaigns().filter(c => c.status === 'approved');
  const raised = list.reduce((s, c) => s + c.raised, 0);
  const donors = list.reduce((s, c) => s + c.donors, 0);
  const elR = document.getElementById('stat-raised');
  const elC = document.getElementById('stat-campaigns');
  const elD = document.getElementById('stat-donors');
  if (elR) elR.textContent = formatPeso(raised);
  if (elC) elC.textContent = list.length;
  if (elD) elD.textContent = donors;
}
