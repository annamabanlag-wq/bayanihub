// BayaniHub cloud bridge (browser-safe publishable key)
// Public data access is restricted by Supabase RLS. Never put a service_role key in this file.

const BAYANI_SUPABASE_URL = 'https://ftyjqmhypjbyqozpoezr.supabase.co';
const BAYANI_SUPABASE_KEY = 'sb_publishable_881nNtqPnpSe0V3F8w6Brg_IvxkweTl';

function bayaniUuid() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function bayaniIsUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function bayaniFetch(path, options = {}) {
  const response = await fetch(BAYANI_SUPABASE_URL + '/rest/v1/' + path, {
    ...options,
    headers: {
      apikey: BAYANI_SUPABASE_KEY,
      Authorization: 'Bearer ' + BAYANI_SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (_) { body = text; }

  if (!response.ok) {
    const message = body && body.message ? body.message : (typeof body === 'string' ? body : 'Supabase request failed');
    throw new Error(message + ' (HTTP ' + response.status + ')');
  }
  return body;
}

function bayaniMapCampaign(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    story: row.story,
    goal: Number(row.goal || 0),
    raised: Number(row.raised || 0),
    donors: Number(row.donors || 0),
    image: row.image || 'https://placehold.co/600x400/0d9488/white?text=BayaniHub',
    organizer: row.organizer || '',
    location: row.location || '',
    contact: row.contact || '',
    gcash: row.gcash || '',
    verified: !!row.verified,
    urgent: !!row.urgent,
    status: row.status || 'pending',
    followupPaid: !!row.followup_paid,
    followupRef: row.followup_ref || '',
    evidence: Array.isArray(row.evidence) ? row.evidence : [],
    sample: !!row.sample,
    created: row.created_at || ''
  };
}

async function syncBayaniCampaigns() {
  const rows = await bayaniFetch(
    'public_campaigns?select=*&order=created_at.desc',
    { method: 'GET' }
  );
  const cloud = (Array.isArray(rows) ? rows : []).map(bayaniMapCampaign);

  // Keep local pending/submissions as fallback, while replacing demo/sample rows
  // with their canonical cloud UUIDs to avoid duplicate campaigns.
  const local = BayaniStorage.getCampaigns();
  const nonSampleLocal = local.filter(c => !c.sample && c.status === 'pending' && !cloud.some(x => x.id === c.id));
  BayaniStorage.saveCampaigns([...cloud, ...nonSampleLocal]);
  return cloud;
}

async function getBayaniCampaign(id) {
  if (!bayaniIsUuid(id)) return null;
  const rows = await bayaniFetch(
    'public_campaigns?select=*&id=eq.' + encodeURIComponent(id) + '&limit=1',
    { method: 'GET' }
  );
  return Array.isArray(rows) && rows[0] ? bayaniMapCampaign(rows[0]) : null;
}

async function submitBayaniCampaign(campaign) {
  const id = bayaniIsUuid(campaign.id) ? campaign.id : bayaniUuid();
  const payload = {
    id,
    title: campaign.title,
    category: campaign.category,
    story: campaign.story,
    goal: Number(campaign.goal),
    raised: 0,
    donors: 0,
    image: campaign.image || null,
    organizer: campaign.organizer,
    location: campaign.location,
    contact: campaign.contact || null,
    gcash: campaign.gcash || null,
    verified: false,
    urgent: false,
    status: 'pending',
    followup_paid: !!campaign.followupPaid,
    followup_ref: campaign.followupRef || null,
    evidence: Array.isArray(campaign.evidence) ? campaign.evidence : [],
    sample: false
  };

  const rows = await bayaniFetch('campaigns', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return bayaniMapCampaign(payload);
}

async function submitBayaniDonation({ campaignId, campaignTitle, name, amount, ref, tip = 0 }) {
  if (!bayaniIsUuid(campaignId)) {
    throw new Error('This campaign is using an old local ID. Please refresh Discover and try again.');
  }

  const payload = {
    campaign_id: campaignId,
    campaign_title: campaignTitle,
    donor_name: name || 'Anonymous',
    amount: Math.round(Number(amount)),
    tip: Math.max(0, Math.round(Number(tip) || 0)),
    fee: 0,
    organizer_amount: 0,
    platform_amount: 0,
    gcash_ref: ref,
    status: 'pending_verification'
  };

  await bayaniFetch('donations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return payload;
}

const BAYANI_SESSION_KEY = 'bayani_supabase_session';

function bayaniGetSession() {
  try {
    // Use localStorage so multiple BayaniHub tabs share the newest rotated
    // Supabase refresh token. A second tab must not leave this tab holding
    // an already-consumed refresh token and produce a false "JWT expired".
    const local = localStorage.getItem(BAYANI_SESSION_KEY);
    if (local) return JSON.parse(local);

    // Migrate an older sessionStorage-only session once.
    const legacy = sessionStorage.getItem(BAYANI_SESSION_KEY);
    if (legacy) {
      localStorage.setItem(BAYANI_SESSION_KEY, legacy);
      sessionStorage.removeItem(BAYANI_SESSION_KEY);
      return JSON.parse(legacy);
    }
    return null;
  } catch (_) {
    return null;
  }
}

function bayaniSaveSession(session) {
  try {
    if (session) {
      const serialized = JSON.stringify(session);
      localStorage.setItem(BAYANI_SESSION_KEY, serialized);
      sessionStorage.removeItem(BAYANI_SESSION_KEY);
    } else {
      localStorage.removeItem(BAYANI_SESSION_KEY);
      sessionStorage.removeItem(BAYANI_SESSION_KEY);
    }
  } catch (_) {
    // If storage is unavailable, the current request can still continue.
  }
}

async function bayaniAuth(path, options = {}) {
  const response = await fetch(BAYANI_SUPABASE_URL + '/auth/v1/' + path, {
    ...options,
    headers: {
      apikey: BAYANI_SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (_) { body = text; }
  if (!response.ok) {
    const msg = body && (body.msg || body.message || body.error_description || body.error)
      ? (body.msg || body.message || body.error_description || body.error)
      : 'Authentication request failed';
    throw new Error(msg + ' (HTTP ' + response.status + ')');
  }
  return body;
}

let bayaniRefreshPromise = null;

async function bayaniRefreshSession() {
  const current = bayaniGetSession();
  if (!current?.refresh_token) throw new Error('Staff session expired. Please sign in again.');

  if (!bayaniRefreshPromise) {
    bayaniRefreshPromise = bayaniAuth('token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: current.refresh_token })
    }).then(session => {
      bayaniSaveSession(session);
      return session;
    }).catch(err => {
      // Do not silently keep a known-invalid token. The admin page will send
      // the user back to login when the refresh token itself is no longer valid.
      bayaniSaveSession(null);
      throw new Error('Staff session expired. Please sign in again.');
    }).finally(() => {
      bayaniRefreshPromise = null;
    });
  }

  return bayaniRefreshPromise;
}

async function bayaniAuthFetch(path, options = {}) {
  const session = bayaniGetSession();
  if (!session || !session.access_token) throw new Error('Staff session expired. Please sign in again.');

  const request = token => bayaniFetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: 'Bearer ' + token
    }
  });

  try {
    return await request(session.access_token);
  } catch (err) {
    if (!/HTTP 401\b/.test(String(err?.message || err))) throw err;
    const refreshed = await bayaniRefreshSession();
    return request(refreshed.access_token);
  }
}

async function bayaniSignIn(email, password) {
  const session = await bayaniAuth('token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email: String(email).trim(), password })
  });
  bayaniSaveSession(session);
  return session;
}

async function bayaniSignUp(email, password) {
  const result = await bayaniAuth('signup', {
    method: 'POST',
    body: JSON.stringify({ email: String(email).trim(), password })
  });
  if (result && result.access_token) bayaniSaveSession(result);
  return result;
}

async function bayaniSignOut() {
  const session = bayaniGetSession();

  // Clear the browser session first so logout can never trap the user
  // behind a slow/offline Supabase logout request.
  bayaniSaveSession(null);
  if (window.BayaniStorage) BayaniStorage.setAdmin(false);

  // Best-effort server-side session revocation. The UI does not wait for it.
  if (session && session.access_token) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      await bayaniAuth('logout', {
        method: 'POST',
        signal: controller.signal,
        headers: { Authorization: 'Bearer ' + session.access_token }
      });
    } catch (_) {
      // Local session is already cleared; network/logout errors are harmless.
    } finally {
      clearTimeout(timer);
    }
  }
}

async function bayaniCheckAdmin() {
  const rows = await bayaniAuthFetch('admin_users?select=user_id&limit=1', { method: 'GET' });
  return Array.isArray(rows) && rows.length > 0;
}

async function bayaniBootstrapAdmin(setupToken) {
  const session = bayaniGetSession();
  if (!session || !session.access_token) throw new Error('Staff session expired. Please sign in again.');

  const response = await fetch(BAYANI_SUPABASE_URL + '/functions/v1/bootstrap-bayani-admin', {
    method: 'POST',
    headers: {
      apikey: BAYANI_SUPABASE_KEY,
      Authorization: 'Bearer ' + session.access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ setupToken })
  });

  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (_) { body = text; }

  if (!response.ok) {
    throw new Error(body?.error || body?.message || 'Admin activation failed (HTTP ' + response.status + ')');
  }

  return body?.ok === true;
}

async function bayaniRequireAdmin() {
  const session = bayaniGetSession();
  if (!session || !session.access_token) return false;
  try {
    return await bayaniCheckAdmin();
  } catch (err) {
    if (/401|expired|session/i.test(String(err?.message || err))) {
      bayaniSaveSession(null);
      return false;
    }
    throw err;
  }
}

async function bayaniAdminDashboard() {
  return bayaniAuthFetch('rpc/bayani_admin_dashboard', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

async function bayaniAdminListCampaigns() {
  return bayaniAuthFetch('campaigns?select=*&order=created_at.desc', { method: 'GET' });
}

async function bayaniAdminListDonations() {
  return bayaniAuthFetch('donations?select=*&order=created_at.desc', { method: 'GET' });
}

async function bayaniAdminListRevenue() {
  return bayaniAuthFetch('revenue_ledger?select=*&order=created_at.desc', { method: 'GET' });
}

async function bayaniAdminListAuditLog() {
  return bayaniAuthFetch('admin_audit_log?select=*&order=created_at.desc&limit=50', { method: 'GET' });
}

async function bayaniAdminUpdateCampaign(id, changes) {
  const payload = {
    p_campaign_id: id,
    p_status: Object.prototype.hasOwnProperty.call(changes || {}, 'status') ? (changes.status ?? null) : null,
    p_verified: Object.prototype.hasOwnProperty.call(changes || {}, 'verified') ? (changes.verified ?? null) : null,
    p_urgent: Object.prototype.hasOwnProperty.call(changes || {}, 'urgent') ? (changes.urgent ?? null) : null
  };
  return bayaniAuthFetch('rpc/bayani_admin_update_campaign', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function bayaniAdminRejectDonation(id) {
  return bayaniAuthFetch('donations?id=eq.' + encodeURIComponent(id), {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status: 'rejected' })
  });
}

async function bayaniAdminConfirmDonation(id) {
  return bayaniAuthFetch('rpc/bayani_admin_confirm_donation', {
    method: 'POST',
    body: JSON.stringify({ p_donation_id: id })
  });
}

async function bayaniAdminListPayouts() {
  return bayaniAuthFetch('donation_payouts?select=*&order=created_at.desc', { method: 'GET' });
}

async function bayaniAdminRecordPayout(id, payoutRef, note = '') {
  return bayaniAuthFetch('rpc/bayani_admin_record_payout', {
    method: 'POST',
    body: JSON.stringify({
      p_payout_id: id,
      p_payout_ref: String(payoutRef || '').trim(),
      p_note: String(note || '').trim() || null
    })
  });
}


async function bayaniSubmitSponsorPayment({ name, packageId, packageName, amount, ref }) {
  const payload = {
    name: String(name || '').trim(),
    package_id: String(packageId || '').trim(),
    package_name: String(packageName || '').trim(),
    amount: Math.round(Number(amount) || 0),
    gcash_ref: String(ref || '').trim(),
    status: 'pending_verification'
  };
  if (!payload.name || !payload.package_id || !payload.package_name || payload.amount <= 0 || payload.gcash_ref.length < 3) {
    throw new Error('Please complete the sponsor name, package, amount, and GCash reference.');
  }
  return bayaniFetch('sponsor_requests', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function bayaniSubmitFollowupPayment({ campaignId, ref }) {
  const payload = {
    campaign_id: campaignId,
    amount: 50,
    gcash_ref: String(ref || '').trim(),
    status: 'pending_verification'
  };
  if (!bayaniIsUuid(campaignId)) throw new Error('Campaign ID is invalid.');
  if (payload.gcash_ref.length < 3) throw new Error('GCash reference is required for the ₱50 follow-up option.');
  return bayaniFetch('followup_requests', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function bayaniAdminListFollowups() {
  return bayaniAuthFetch('followup_requests?select=*&order=created_at.desc', { method: 'GET' });
}

async function bayaniAdminReviewFollowup(id, approved, adminNote = '') {
  return bayaniAuthFetch('followup_requests?id=eq.' + encodeURIComponent(id), {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      status: approved ? 'confirmed' : 'rejected',
      admin_note: String(adminNote || '').trim() || null
    })
  });
}

async function bayaniAdminListSponsors() {
  return bayaniAuthFetch('sponsor_requests?select=*&order=created_at.desc', { method: 'GET' });
}

async function bayaniAdminReviewSponsor(id, approved, adminNote = '') {
  return bayaniAuthFetch('sponsor_requests?id=eq.' + encodeURIComponent(id), {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      status: approved ? 'confirmed' : 'rejected',
      admin_note: String(adminNote || '').trim() || null
    })
  });
}

window.BayaniCloud = {
  syncCampaigns: syncBayaniCampaigns,
  getCampaign: getBayaniCampaign,
  submitCampaign: submitBayaniCampaign,
  submitDonation: submitBayaniDonation,
  getSession: bayaniGetSession,
  signIn: bayaniSignIn,
  signUp: bayaniSignUp,
  signOut: bayaniSignOut,
  checkAdmin: bayaniCheckAdmin,
  bootstrapAdmin: bayaniBootstrapAdmin,
  requireAdmin: bayaniRequireAdmin,
  adminDashboard: bayaniAdminDashboard,
  adminListCampaigns: bayaniAdminListCampaigns,
  adminListDonations: bayaniAdminListDonations,
  adminListRevenue: bayaniAdminListRevenue,
  adminListAuditLog: bayaniAdminListAuditLog,
  adminUpdateCampaign: bayaniAdminUpdateCampaign,
  adminConfirmDonation: bayaniAdminConfirmDonation,
  adminListPayouts: bayaniAdminListPayouts,
  adminRecordPayout: bayaniAdminRecordPayout,
  adminRejectDonation: bayaniAdminRejectDonation,
  submitSponsorPayment: bayaniSubmitSponsorPayment,
  adminListSponsors: bayaniAdminListSponsors,
  adminReviewSponsor: bayaniAdminReviewSponsor,
  submitFollowupPayment: bayaniSubmitFollowupPayment,
  adminListFollowups: bayaniAdminListFollowups,
  adminReviewFollowup: bayaniAdminReviewFollowup
};
