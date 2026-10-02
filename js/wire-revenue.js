// Loaded after campaign and admin pages. Patches the live donate/admin flows.
(function () {
  if (!window.BayaniRevenue || !window.Storage) return;

  const feeNote = document.getElementById('donor-amount');
  if (feeNote && !document.getElementById('fee-preview')) {
    const preview = document.createElement('p');
    preview.id = 'fee-preview';
    preview.className = 'text-[11px] text-gray-500';
    preview.textContent = '5% platform fee. 95% goes to the campaign after admin confirms the GCash ref.';
    feeNote.parentElement.appendChild(preview);
    const tipWrap = document.createElement('div');
    tipWrap.innerHTML = '<label class="text-xs font-medium text-gray-600">Optional tip to BayaniHub (\u20b1)</label><input id="donor-tip" type="number" min="0" value="0" class="w-full mt-0.5 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none">';
    feeNote.parentElement.after(tipWrap);
    const paint = () => {
      const split = BayaniRevenue.split(feeNote.value, document.getElementById('donor-tip')?.value);
      preview.textContent = split.gross
        ? `Campaign gets ${formatPeso(split.organizer)}. BayaniHub keeps ${formatPeso(split.platform)} after confirmation.`
        : '5% platform fee. 95% goes to the campaign after admin confirms the GCash ref.';
    };
    feeNote.addEventListener('input', paint);
    tipWrap.querySelector('input').addEventListener('input', paint);
  }

  if (typeof submitDonation === 'function' && !submitDonation._bayaniWired) {
    const original = submitDonation;
    window.submitDonation = function () {
      const name = document.getElementById('donor-name').value.trim() || 'Anonymous';
      const amount = parseFloat(document.getElementById('donor-amount').value);
      const tip = parseFloat(document.getElementById('donor-tip')?.value || '0') || 0;
      const ref = document.getElementById('donor-ref').value.trim();
      if (!amount || amount < BayaniRevenue.minDonation) {
        alert('Please enter a valid amount (minimum \u20b150).');
        return;
      }
      if (!ref) {
        alert('Please enter your GCash reference number so admin can verify.');
        return;
      }
      const split = BayaniRevenue.split(amount, tip);
      Storage.addDonation({
        id: 'd' + Date.now(),
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        name,
        amount: split.gross,
        tip: split.tip,
        split,
        ref,
        date: new Date().toISOString(),
        status: 'pending_verification'
      });
      closeDonateModal();
      alert('Maraming salamat. This is pending, not paid.\n\nCampaign share: ' + formatPeso(split.organizer) + '\nBayaniHub fee + tip: ' + formatPeso(split.platform) + '\nRef: ' + ref + '\n\nRaised totals update only after admin confirms the GCash transfer.');
    };
    window.submitDonation._bayaniWired = true;
    void original;
  }

  if (document.getElementById('don-list') && !window.confirmBayaniGift) {
    window.confirmBayaniGift = function (id) {
      const dons = Storage.getDonations();
      const d = dons.find(x => x.id === id);
      if (!d || d.status === 'confirmed') return;
      const split = d.split || BayaniRevenue.split(d.amount, d.tip || 0);
      d.status = 'confirmed';
      d.split = split;
      localStorage.setItem('bayani_donations', JSON.stringify(dons));
      const list = Storage.getCampaigns();
      const idx = list.findIndex(c => c.id === d.campaignId);
      if (idx > -1) {
        list[idx].raised = Number(list[idx].raised || 0) + split.organizer;
        list[idx].donors = Number(list[idx].donors || 0) + 1;
        Storage.saveCampaigns(list);
      }
      BayaniRevenue.addLedger({
        id: 'g' + Date.now(),
        kind: 'gift',
        status: 'confirmed',
        name: d.name,
        campaignTitle: d.campaignTitle,
        platform: split.platform,
        organizer: split.organizer,
        ref: d.ref,
        date: new Date().toISOString()
      });
      if (typeof renderAdmin === 'function') renderAdmin();
    };
    window.confirmBayaniSponsor = function (id) {
      const rows = BayaniRevenue.ledger();
      const row = rows.find(x => x.id === id);
      if (!row || row.status === 'confirmed') return;
      row.status = 'confirmed';
      BayaniRevenue.saveLedger(rows);
      if (typeof renderAdmin === 'function') renderAdmin();
    };
    const old = renderAdmin;
    window.renderAdmin = function () {
      old();
      const totals = BayaniRevenue.totals();
      if (!document.getElementById('rev-platform')) {
        const grid = document.querySelector('main .grid');
        if (grid) {
          const card = document.createElement('div');
          card.className = 'bg-white rounded-xl border p-3 text-center col-span-3';
          card.innerHTML = '<p class="text-lg font-bold text-brand-700" id="rev-platform">\u20b10</p><p class="text-[10px] text-gray-500">Confirmed platform revenue</p>';
          grid.after(card);
        }
      }
      const el = document.getElementById('rev-platform');
      if (el) el.textContent = formatPeso(totals.platform);
      document.querySelectorAll('#don-list > div').forEach((node, i) => {
        const d = Storage.getDonations()[i];
        if (!d || node.querySelector('[data-confirm]')) return;
        const btn = document.createElement('button');
        btn.dataset.confirm = d.id;
        btn.className = 'text-[10px] font-bold px-2 py-1 rounded bg-teal-600 text-white ml-2';
        btn.textContent = d.status === 'confirmed' ? 'Confirmed' : 'Confirm GCash';
        btn.disabled = d.status === 'confirmed';
        btn.onclick = () => confirmBayaniGift(d.id);
        node.appendChild(btn);
      });
      const pendingSponsors = BayaniRevenue.ledger().filter(r => r.kind === 'sponsor' && r.status !== 'confirmed');
      if (pendingSponsors.length && !document.getElementById('sponsor-queue')) {
        const sec = document.createElement('section');
        sec.id = 'sponsor-queue';
        sec.innerHTML = '<h3 class="text-sm font-semibold text-gray-700 mb-3">Sponsor payments</h3><div class="space-y-2"></div>';
        document.querySelector('main').insertBefore(sec, document.querySelector('main section'));
      }
      const q = document.querySelector('#sponsor-queue div');
      if (q) {
        q.innerHTML = pendingSponsors.map(s => `
          <div class="bg-white rounded-xl border p-3 flex justify-between items-center text-sm">
            <div><p class="font-medium">${s.packageName}</p><p class="text-xs text-gray-500">${s.name} · ${s.ref}</p></div>
            <button class="text-[10px] font-bold px-2 py-1 rounded bg-amber-500 text-white" onclick="confirmBayaniSponsor('${s.id}')">Confirm ${formatPeso(s.platform)}</button>
          </div>`).join('') || '<p class="text-sm text-gray-500">No pending sponsors</p>';
      }
    };
    renderAdmin();
  }

  document.querySelectorAll('a[href^="mailto:sponsor@bayanihub.ph"]').forEach(a => {
    a.href = 'sponsor.html';
    a.removeAttribute('target');
  });
})();
