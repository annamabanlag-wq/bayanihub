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
    gcash: row.gcash || '09381447214',
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
    'campaigns?select=*&status=eq.approved&order=created_at.desc',
    { method: 'GET' }
  );
  const cloud = (Array.isArray(rows) ? rows : []).map(bayaniMapCampaign);

  // Keep local pending/submissions as fallback, while replacing demo/sample rows
  // with their canonical cloud UUIDs to avoid duplicate campaigns.
  const local = Storage.getCampaigns();
  const nonSampleLocal = local.filter(c => !c.sample && !cloud.some(x => x.id === c.id));
  Storage.saveCampaigns([...cloud, ...nonSampleLocal]);
  return cloud;
}

async function getBayaniCampaign(id) {
  if (!bayaniIsUuid(id)) return null;
  const rows = await bayaniFetch(
    'campaigns?select=*&id=eq.' + encodeURIComponent(id) + '&status=eq.approved&limit=1',
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
    gcash: campaign.gcash || '09381447214',
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
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload)
  });

  return Array.isArray(rows) && rows[0]
    ? bayaniMapCampaign(rows[0])
    : bayaniMapCampaign(payload);
}

async function submitBayaniDonation({ campaignId, campaignTitle, name, amount, ref }) {
  if (!bayaniIsUuid(campaignId)) {
    throw new Error('This campaign is using an old local ID. Please refresh Discover and try again.');
  }

  const payload = {
    campaign_id: campaignId,
    campaign_title: campaignTitle,
    donor_name: name || 'Anonymous',
    amount: Math.round(Number(amount)),
    tip: 0,
    fee: 0,
    organizer_amount: 0,
    platform_amount: 0,
    gcash_ref: ref,
    status: 'pending_verification'
  };

  const rows = await bayaniFetch('donations', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload)
  });

  return Array.isArray(rows) && rows[0] ? rows[0] : payload;
}

window.BayaniCloud = {
  syncCampaigns: syncBayaniCampaigns,
  getCampaign: getBayaniCampaign,
  submitCampaign: submitBayaniCampaign,
  submitDonation: submitBayaniDonation
};
