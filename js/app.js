// BayaniHub main discovery logic
let activeCategory = null;
let searchQuery = '';
let sortBy = 'recent';
const CAMPAIGN_FALLBACK_IMAGES = {
  medical: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?auto=format&fit=crop&w=1200&q=85',
  hospital: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?auto=format&fit=crop&w=1200&q=85',
  disability: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3b5c4?auto=format&fit=crop&w=1200&q=85',
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85',
  bereavement: 'https://images.unsplash.com/photo-1491438590914-bc09fbaafb2f?auto=format&fit=crop&w=1200&q=85',
  pet: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85',
  education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85',
  environment: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85',
  community: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85',
  default: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?auto=format&fit=crop&w=1200&q=85'
};

function getCampaignFallbackImage(category, campaign) {
  const key = String(category || '').toLowerCase().trim();
  const description = [campaign?.title, campaign?.story, campaign?.organizer].join(' ').toLowerCase();
  if (['hospital', 'medical'].includes(key) && /mother|mom|nanay|lola|grandmother|elderly|senior|dialysis/.test(description)) {
    return 'https://images.pexels.com/photos/5692694/pexels-photo-5692694.jpeg?auto=compress&dpr=1&h=750&w=1260';
  }
  return CAMPAIGN_FALLBACK_IMAGES[key] || CAMPAIGN_FALLBACK_IMAGES.default;
}

function isCampaignPlaceholderImage(value) {
  const image = String(value || '').trim().toLowerCase();
  return !image ||
    image.includes('bayanihub-cover.svg') ||
    image.includes('placehold.co') ||
    image.includes('text=bayanihub') ||
    image.includes('placeholder') ||
    image.includes('photo-1631217868264-e5b90bb7e133') ||
    image.includes('photo-1576091160399-112ba8d25d1d');
}


function bayaniEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[ch]));
}

function bayaniSafeImage(value) {
  const fallback = 'assets/bayanihub-cover.svg';
  try {
    const u = new URL(String(value || ''), location.href);
    if (u.protocol === 'http:' || u.protocol === 'https:') return bayaniEsc(u.href);
  } catch (_) {}
  return fallback;
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
  container.innerHTML = CATEGORIES.map(c => {
    const id = bayaniEsc(c.id);
    const label = bayaniEsc(c.label);
    const icon = bayaniEsc(c.icon);
    return `
      <button data-cat="${id}"
        class="cat-btn flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition
          ${activeCategory === c.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'}">
        <span>${icon}</span> ${label}
      </button>
    `;
  }).join('');

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
    const fallbackImage = bayaniSafeImage(getCampaignFallbackImage(c.category, c));
    const suppliedImage = String(c.image || '').trim();
    const hasSuppliedImage = !isCampaignPlaceholderImage(suppliedImage);
    const image = hasSuppliedImage ? bayaniSafeImage(suppliedImage) : fallbackImage;
    const catLabel = bayaniEsc(cat.label);
    const catIcon = bayaniEsc(cat.icon);
    const created = bayaniEsc(c.created);
    const isDemo = c.sample === true;

    const fundingBlock = isDemo
      ? `<div class="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-2">
          <p class="text-xs font-semibold text-slate-700">Example campaign only</p>
          <p class="text-[10px] text-slate-500 mt-0.5">Story and amounts are for demonstration. Donations are disabled.</p>
        </div>`
      : `<div class="mb-2">
          <div class="flex justify-between text-xs mb-1">
            <span class="font-semibold text-brand-700">${formatPeso(c.raised)}</span>
            <span class="text-gray-500">of ${formatPeso(c.goal)}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="progress-bar h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style="width:${Math.min(100, Math.max(0, Number(pct) || 0))}%"></div>
          </div>
        </div>`;

    const footerBlock = isDemo
      ? '<span class="text-slate-500">Example only</span><span class="text-slate-400">Donations disabled</span>'
      : `<span>${Number(c.donors || 0)} donors</span><span>${Math.min(100, Math.max(0, Number(pct) || 0))}% funded • ${timeAgo(created)}</span>`;

    return `
    <article style="animation-delay:${Math.min(index * 70, 420)}ms" class="card-hover bg-white rounded-2xl shadow-sm border ${isDemo ? 'border-slate-200' : 'border-gray-100'} overflow-hidden fade-in cursor-pointer" onclick="location.href='campaign.html?id=${encodeURIComponent(c.id)}'">
      <div class="relative isolate overflow-hidden">
        <img src="${image}" data-fallback="${fallbackImage}" alt="${title} — illustrative campaign image" class="w-full h-52 md:h-56 object-cover transition duration-500 hover:scale-[1.02]" loading="lazy" referrerpolicy="no-referrer" onerror="if(this.dataset.fallbackApplied!=='1'){this.dataset.fallbackApplied='1';this.src=this.dataset.fallback;const tag=this.parentElement.querySelector('.illustrative-photo-label');if(tag)tag.classList.remove('hidden')}else{this.onerror=null;this.src='assets/bayanihub-cover.svg'}">
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/10"></div>
        <span class="absolute top-3 left-3 ${cat.color} text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">${catIcon} ${catLabel}</span>
        ${isDemo ? '<span class="absolute top-3 right-3 bg-slate-800/90 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">DEMO</span>' : (c.urgent ? '<span class="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">URGENT</span>' : (c.verified ? '<span class="absolute top-3 right-3 badge-verified text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">✓ VERIFIED</span>' : ''))}
        <span class="illustrative-photo-label ${hasSuppliedImage ? 'hidden' : ''} absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">Illustrative photo</span>
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 class="font-extrabold text-lg md:text-xl leading-tight line-clamp-2 drop-shadow-sm">${title}</h3>
          <p class="mt-1.5 flex items-center gap-1 text-xs text-white/90"><span aria-hidden="true">📍</span><span class="line-clamp-1">${location}</span></p>
        </div>
      </div>
      <div class="p-4">
        ${isDemo ? '<div class="mb-2"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">DEMO • NOT A REAL FUNDRAISER</span></div>' : ''}
        ${fundingBlock}
        <div class="flex items-center justify-between gap-3 text-xs text-gray-500">
          <span class="shrink-0">${footerBlock.split('</span><span>')[0].replace(/^<span>/,'').replace(/<\/span>$/,'')}</span>
          <span class="text-right">${isDemo ? 'Donations disabled' : `${Math.min(100, Math.max(0, Number(pct) || 0))}% funded • ${timeAgo(created)}`}</span>
        </div>
      </div>
    </article>`;
  }).join('');
}
function updateStats() {
  // Demo/sample stories never count as real campaigns, donations, or donors.
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
