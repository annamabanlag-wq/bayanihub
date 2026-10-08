import { createClient } from '@supabase/supabase-js'
import './style.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

const CATEGORIES = [
  'Virtual Assistant',
  'Graphic Design',
  'Video Editing',
  'Social Media',
  'Writing',
  'Tutoring',
  'Bookkeeping',
  'Data Entry',
  'Web / Tech',
  'Culinary / Food',
  'Cleaning',
  'Beauty',
  'Repair / Trade',
  'Other'
]

const BOOSTS = [
  { name: 'Featured 3 days', amount: 49, text: 'Jump to the top for 3 days.' },
  { name: 'Featured 7 days', amount: 99, text: 'Get stronger visibility for a full week.' },
  { name: 'Pro Provider 30 days', amount: 199, text: 'Verified + featured for 30 days.' }
]

const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })

function e(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function safeLink(value) {
  const v = String(value || '').trim()
  if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v
  return '#'
}

function navTo(id) {
  document.querySelectorAll('section[data-section]').forEach(s => s.classList.toggle('active', s.id === id))
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === id))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function appShell() {
  document.querySelector('#app').innerHTML = `
    <header class="topbar">
      <div class="wrap navwrap">
        <button class="brand" data-go="home">
          <span class="brandmark">T</span>
          <span>
            <strong>TaskBayan</strong>
            <small>PH</small>
          </span>
        </button>
        <nav>
          <button data-nav="find">Find Talent</button>
          <button data-nav="work">Find Jobs</button>
          <button data-nav="join">Offer Skills</button>
        </nav>
        <button class="ghost small" data-go="admin">Operator</button>
      </div>
    </header>

    <main>
      <section id="home" data-section class="active">
        <div class="hero wrap">
          <div class="hero-copy">
            <span class="eyebrow">BUILT FOR FILIPINO SIDE HUSTLES</span>
            <h1>Small jobs.<br><span>Real skills.</span><br>Extra income.</h1>
            <p class="lead">TaskBayan connects people who need quick work with Filipinos ready to earn from what they already know.</p>
            <div class="cta-row">
              <button class="primary" data-go="find">Find someone</button>
              <button class="secondary" data-go="join">Sell your skills</button>
            </div>
            <div class="trustrow">
              <span>₱0 to join</span>
              <span>Phone-first</span>
              <span>Human-reviewed listings</span>
            </div>
          </div>
          <div class="hero-card">
            <div class="card-top">
              <span class="live-dot"></span> LIVE MARKET
              <span class="tag">No app store needed</span>
            </div>
            <div class="quick-grid">
              <div><strong>₱99+</strong><span>Micro-jobs</span></div>
              <div><strong>1 tap</strong><span>Contact</span></div>
              <div><strong>3 ways</strong><span>Earn as platform</span></div>
              <div><strong>24/7</strong><span>Online access</span></div>
            </div>
            <div class="revenue-box">
              <b>How TaskBayan earns</b>
              <p>Providers list for free. We charge only for <strong>boosted visibility</strong> and optional <strong>lead packages</strong>.</p>
            </div>
          </div>
        </div>

        <div class="wrap sectionpad">
          <div class="section-head">
            <div>
              <span class="eyebrow">THE FIRST MOVE</span>
              <h2>Start with one paid outcome</h2>
            </div>
            <p>We do not need thousands of users before earning. A provider can buy visibility as soon as there are real customers looking.</p>
          </div>
          <div class="money-cards">
            <article><span>01</span><h3>Featured listing</h3><p>₱49 for 3 days. Put a provider in front of active buyers.</p></article>
            <article><span>02</span><h3>Weekly feature</h3><p>₱99 for 7 days. The simple recurring offer.</p></article>
            <article><span>03</span><h3>Pro provider</h3><p>₱199 for 30 days. Verified + featured positioning.</p></article>
          </div>
        </div>

        <div class="wrap sectionpad darkpanel">
          <div>
            <span class="eyebrow">WHY THIS MODEL</span>
            <h2>We sell attention, not inventory.</h2>
            <p class="muted">No warehouse. No delivery fleet. No paid ads required to launch. Your full-time work is recruiting providers, finding buyers, and closing the first paid boosts.</p>
          </div>
          <div class="playbook">
            <div><b>Morning</b><span>Recruit 20 providers from Facebook groups and communities.</span></div>
            <div><b>Afternoon</b><span>Post useful job-matching content and answer customer requests.</span></div>
            <div><b>Evening</b><span>Sell featured placement to providers who want more leads.</span></div>
          </div>
        </div>
      </section>

      <section id="find" data-section>
        <div class="wrap page">
          <div class="pagehead">
            <div><span class="eyebrow">MARKETPLACE</span><h2>Find someone who can do it.</h2><p>Search approved providers by skill, city, or keyword.</p></div>
            <button class="secondary" data-go="join">Add my skill</button>
          </div>
          <div class="filters">
            <input id="providerSearch" placeholder="Search skill, name, city..." />
            <select id="providerCategory"><option value="">All skills</option>${CATEGORIES.map(c => `<option>${e(c)}</option>`).join('')}</select>
            <input id="providerCity" placeholder="City e.g. Quezon City" />
          </div>
          <div id="providers" class="cards"></div>
        </div>
      </section>

      <section id="work" data-section>
        <div class="wrap page">
          <div class="pagehead">
            <div><span class="eyebrow">QUICK JOB BOARD</span><h2>Small jobs are posted here.</h2><p>Describe what you need. We match manually at launch.</p></div>
            <button class="primary" data-go="post">Post a job</button>
          </div>
          <div id="jobs" class="joblist"></div>
        </div>
      </section>

      <section id="join" data-section>
        <div class="wrap page two-col">
          <div>
            <span class="eyebrow">EARN WITH YOUR SKILL</span>
            <h2>Turn spare time into paid work.</h2>
            <p>Join free. After approval, your listing can appear in search. Customers contact you directly.</p>
            <div class="mini-note">There is no platform fee on the customer-to-provider payment in this MVP. Our initial revenue comes from optional visibility products.</div>
          </div>
          <form id="providerForm" class="formcard">
            <h3>Create my listing</h3>
            <label>Name / brand<input name="name" required maxlength="80" placeholder="e.g. Maria's Canva Studio" /></label>
            <label>Skill<select name="category" required>${CATEGORIES.map(c => `<option>${e(c)}</option>`).join('')}</select></label>
            <label>City<input name="city" required maxlength="80" placeholder="Quezon City" /></label>
            <label>Starting price<input name="starting_price" required type="number" min="0" step="1" placeholder="500" /></label>
            <label>What can you do?<textarea name="bio" required minlength="20" maxlength="500" placeholder="Tell buyers what you can deliver and how fast."></textarea></label>
            <label>Contact link<input name="contact_link" required placeholder="https://m.me/... or mailto:..." /></label>
            <button class="primary" type="submit">Submit for review</button>
            <div id="providerMsg" class="formmsg"></div>
          </form>
        </div>
      </section>

      <section id="post" data-section>
        <div class="wrap page two-col">
          <div>
            <span class="eyebrow">NEED SOMEONE</span>
            <h2>Post a small job.</h2>
            <p>Use clear details and a realistic budget. We will use the operator inbox to match you with providers.</p>
          </div>
          <form id="jobForm" class="formcard">
            <h3>Request a service</h3>
            <label>Service<select name="service_category" required>${CATEGORIES.map(c => `<option>${e(c)}</option>`).join('')}</select></label>
            <label>Job title<input name="title" required maxlength="100" placeholder="Edit 10 short videos for TikTok" /></label>
            <label>Description<textarea name="description" required minlength="10" maxlength="1000" placeholder="What needs to be done? Deadline? Important details?"></textarea></label>
            <label>City / remote<input name="city" required maxlength="80" placeholder="Remote / Quezon City" /></label>
            <div class="row2">
              <label>Budget from<input name="budget_min" type="number" min="0" step="1" placeholder="300" /></label>
              <label>Budget to<input name="budget_max" type="number" min="0" step="1" placeholder="1000" /></label>
            </div>
            <label>How should we contact you?<input name="contact_link" required placeholder="Messenger link, email or phone link" /></label>
            <button class="primary" type="submit">Post request</button>
            <div id="jobMsg" class="formmsg"></div>
          </form>
        </div>
      </section>

      <section id="admin" data-section>
        <div class="wrap page">
          <div class="pagehead">
            <div><span class="eyebrow">OPERATOR MODE</span><h2>TaskBayan control room</h2><p>This MVP protects customer contact data in Supabase. Use the database dashboard for review and approval.</p></div>
          </div>
          <div class="admin-grid">
            <div class="stat"><strong id="statProviders">—</strong><span>Approved providers</span></div>
            <div class="stat"><strong id="statJobs">—</strong><span>Total job requests</span></div>
            <div class="stat"><strong>₱49–₱199</strong><span>Launch products</span></div>
          </div>
          <div class="operator-box">
            <h3>First-week operator routine</h3>
            <ol>
              <li>Approve strong provider listings in Supabase.</li>
              <li>Use job requests to manually introduce 2–3 providers per buyer.</li>
              <li>Offer ₱49 3-day feature only after a provider sees genuine buyer traffic.</li>
              <li>Record every paid boost so the business has a real ledger.</li>
            </ol>
            <a class="secondary linkbtn" href="https://supabase.com/dashboard/project/ftyjqmhypjbyqozpoezr/editor" target="_blank" rel="noopener">Open Supabase database</a>
          </div>
          <div class="boost-panel">
            <div><span class="eyebrow">MONETIZATION</span><h3>Request a boost</h3><p>Providers can request a paid feature. At launch, we confirm payment manually via GCash and then activate the listing.</p></div>
            <div class="boost-options">${BOOSTS.map(b => `<article><b>${e(b.name)}</b><strong>${money.format(b.amount)}</strong><span>${e(b.text)}</span></article>`).join('')}</div>
            <button class="primary" data-go="find">Find a provider to invite</button>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap foot">
        <div><strong>TaskBayan PH</strong><span>Small jobs. Real skills.</span></div>
        <div><a href="#home" data-go="home">Home</a><a href="#find" data-go="find">Find Talent</a><a href="#join" data-go="join">Offer Skills</a></div>
        <small>Free to join. Human review. GCash/manual payment can be added after the first customer traction.</small>
      </div>
    </footer>
    <div id="toast"></div>
  `
}

async function loadProviders() {
  const host = document.querySelector('#providers')
  if (!supabase) {
    host.innerHTML = '<div class="empty"><h3>Database is not connected yet.</h3><p>Set the Supabase environment variables in the hosting service.</p></div>'
    return
  }
  const { data, error } = await supabase
    .from('gawalink_providers')
    .select('id,name,category,city,bio,starting_price,contact_link,featured_until,verified')
    .eq('status', 'approved')
    .order('featured_until', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) {
    host.innerHTML = '<div class="empty"><h3>Could not load providers.</h3><p>Please retry in a moment.</p></div>'
    return
  }
  renderProviders(data || [])
  updateStats(data || [])
}

function renderProviders(rows) {
  const host = document.querySelector('#providers')
  const search = (document.querySelector('#providerSearch')?.value || '').toLowerCase().trim()
  const cat = document.querySelector('#providerCategory')?.value || ''
  const city = (document.querySelector('#providerCity')?.value || '').toLowerCase().trim()
  const filtered = rows.filter(r => {
    const text = [r.name,r.category,r.city,r.bio].join(' ').toLowerCase()
    return (!search || text.includes(search)) && (!cat || r.category === cat) && (!city || r.city.toLowerCase().includes(city))
  })
  if (!filtered.length) {
    host.innerHTML = '<div class="empty"><h3>No approved listings yet.</h3><p>Be the first provider and get reviewed for free.</p><button class="primary" data-go="join">Join now</button></div>'
    return
  }
  host.innerHTML = filtered.map(r => {
    const featured = r.featured_until && new Date(r.featured_until) > new Date()
    return `
      <article class="provider ${featured ? 'featured' : ''}">
        <div class="provider-head"><span class="avatar">${e((r.name || '?').slice(0,1).toUpperCase())}</span><div><h3>${e(r.name)}</h3><span>${e(r.category)} · ${e(r.city)}</span></div></div>
        <p>${e(r.bio)}</p>
        <div class="provider-bottom"><strong>From ${money.format(r.starting_price)}</strong><div class="badges">${r.verified ? '<span>✓ Verified</span>' : ''}${featured ? '<span>★ Featured</span>' : ''}</div></div>
        <a class="contactbtn" href="${e(safeLink(r.contact_link))}" target="_blank" rel="noopener">Contact provider</a>
        <button class="boostbtn" data-boost="${e(r.id)}" data-name="${e(r.name)}" data-contact="${e(r.contact_link)}">Boost this listing</button>
      </article>
    `
  }).join('')
}

async function loadJobs() {
  const host = document.querySelector('#jobs')
  if (!supabase) {
    host.innerHTML = '<div class="empty"><h3>Job board is warming up.</h3><p>Post your request and the operator will match it manually.</p></div>'
    return
  }
  // Customer contact details stay private; public users only see non-sensitive job summaries.
  const { data, error } = await supabase
    .from('gawalink_job_requests_public')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) {
    host.innerHTML = '<div class="empty"><h3>Job feed is private at launch.</h3><p>Post a request and our operator will match it manually.</p><button class="primary" data-go="post">Post a job</button></div>'
    return
  }
  host.innerHTML = (data || []).length ? data.map(j => `
    <article class="jobrow"><div><span class="eyebrow">${e(j.service_category)}</span><h3>${e(j.title)}</h3><p>${e(j.description)}</p></div><div class="jobmeta"><span>${e(j.city)}</span><strong>${j.budget_min || j.budget_max ? money.format(j.budget_min || 0) + ' – ' + money.format(j.budget_max || j.budget_min || 0) : 'Budget flexible'}</strong></div></article>
  `).join('') : '<div class="empty"><h3>No job requests yet.</h3><p>Post the first one and create the marketplace.</p><button class="primary" data-go="post">Post a job</button></div>'
}

function updateStats(providers) {
  document.querySelector('#statProviders').textContent = providers.length
}

async function updateJobStat() {
  if (!supabase) return
  const { count } = await supabase.from('gawalink_job_requests').select('*', { count: 'exact', head: true })
  document.querySelector('#statJobs').textContent = count ?? 0
}

function toast(message) {
  const t = document.querySelector('#toast')
  t.textContent = message
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 3200)
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries())
}

async function submitProvider(form) {
  const msg = document.querySelector('#providerMsg')
  if (!supabase) { msg.textContent = 'Database is not connected.'; return }
  const d = formData(form)
  const payload = {
    name: d.name.trim(),
    category: d.category,
    city: d.city.trim(),
    bio: d.bio.trim(),
    starting_price: Number(d.starting_price || 0),
    contact_link: d.contact_link.trim(),
    status: 'pending',
    verified: false
  }
  const { error } = await supabase.from('gawalink_providers').insert(payload)
  if (error) {
    msg.textContent = error.message.includes('contact_link') ? 'Use a valid contact URL, email link, or phone link.' : 'Could not submit. Please check the fields.'
    return
  }
  form.reset()
  msg.textContent = 'Submitted. The operator will review your listing before it goes live.'
  toast('Provider submitted for review.')
}

async function submitJob(form) {
  const msg = document.querySelector('#jobMsg')
  if (!supabase) { msg.textContent = 'Database is not connected.'; return }
  const d = formData(form)
  const payload = {
    service_category: d.service_category,
    title: d.title.trim(),
    description: d.description.trim(),
    city: d.city.trim(),
    budget_min: d.budget_min ? Number(d.budget_min) : null,
    budget_max: d.budget_max ? Number(d.budget_max) : null,
    contact_link: d.contact_link.trim(),
    status: 'new'
  }
  const { error } = await supabase.from('gawalink_job_requests').insert(payload)
  if (error) {
    msg.textContent = 'Could not post the request. Please check the fields.'
    return
  }
  form.reset()
  msg.textContent = 'Request posted. We will use the operator inbox to match providers.'
  toast('Job request posted.')
}

async function requestBoost(providerId, providerName, contactLink) {
  const choice = window.prompt('Boost package: type 3, 7, or 30 for days', '3')
  if (!choice) return
  const map = { '3': BOOSTS[0], '7': BOOSTS[1], '30': BOOSTS[2] }
  const pack = map[choice]
  if (!pack) { toast('Choose 3, 7, or 30.'); return }
  if (!supabase) { toast('Database is not connected.'); return }
  const { error } = await supabase.from('gawalink_boost_requests').insert({
    provider_id: providerId,
    provider_name: providerName,
    contact_link: contactLink,
    package: pack.name,
    amount: pack.amount,
    notes: 'Launch flow: confirm payment manually via GCash, then activate feature.',
    status: 'pending'
  })
  if (error) { toast('Could not create boost request.'); return }
  const mail = `mailto:annamabanlag@gmail.com?subject=TaskBayan%20Boost%20Request%20-%20${encodeURIComponent(providerName)}&body=Package:%20${encodeURIComponent(pack.name)}%0AAmount:%20${pack.amount}%0AProvider:%20${encodeURIComponent(providerName)}%0AContact:%20${encodeURIComponent(contactLink)}`
  window.location.href = mail
  toast('Boost request captured. Email the operator to complete payment.')
}

function bind() {
  document.addEventListener('click', (event) => {
    const go = event.target.closest('[data-go]')
    if (go) { event.preventDefault(); navTo(go.dataset.go); return }
    const nav = event.target.closest('[data-nav]')
    if (nav) { navTo(nav.dataset.nav); return }
    const boost = event.target.closest('[data-boost]')
    if (boost) {
      requestBoost(boost.dataset.boost, boost.dataset.name, boost.dataset.contact)
    }
  })

  document.querySelector('#providerSearch')?.addEventListener('input', () => loadProviders())
  document.querySelector('#providerCategory')?.addEventListener('change', () => loadProviders())
  document.querySelector('#providerCity')?.addEventListener('input', () => loadProviders())

  document.querySelector('#providerForm')?.addEventListener('submit', async e2 => {
    e2.preventDefault()
    await submitProvider(e2.currentTarget)
  })
  document.querySelector('#jobForm')?.addEventListener('submit', async e2 => {
    e2.preventDefault()
    await submitJob(e2.currentTarget)
  })
}

async function ensurePublicJobView() {
  if (!supabase) return
  // A safe public view exposes only fields needed for matching.
  // It is created by the migration below before launch.
  await loadJobs()
}

async function start() {
  appShell()
  bind()
  await Promise.all([loadProviders(), ensurePublicJobView(), updateJobStat()])
  const hash = window.location.hash.replace('#','')
  if (['find','work','join','post','admin'].includes(hash)) navTo(hash)
}

start()
