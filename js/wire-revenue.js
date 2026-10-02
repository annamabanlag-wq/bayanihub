// BayaniHub revenue UI helper.
// Secure state changes are handled by Supabase RLS/admin RPCs.
(function () {
  if (document.body?.dataset.cloudAdmin === 'true') return;
  if (!window.BayaniRevenue || !window.Storage) return;

  const feeNote = document.getElementById('donor-amount');
  if (feeNote && !document.getElementById('fee-preview')) {
    const preview = document.createElement('p');
    preview.id = 'fee-preview';
    preview.className = 'text-[11px] text-gray-500';
    preview.textContent = '5% platform fee. 95% goes to the campaign after admin confirms the GCash ref.';

    feeNote.parentElement.appendChild(preview);

    const tipWrap = document.createElement('div');
    tipWrap.innerHTML =
      '<label class="text-xs font-medium text-gray-600">Optional tip to BayaniHub (₱)</label>' +
      '<input id="donor-tip" type="number" min="0" value="0" class="w-full mt-0.5 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none">';
    feeNote.parentElement.after(tipWrap);

    const paint = () => {
      const split = BayaniRevenue.split(feeNote.value, document.getElementById('donor-tip')?.value);
      preview.textContent = split.gross
        ? 'Campaign gets ' + formatPeso(split.organizer) + '. BayaniHub keeps ' + formatPeso(split.platform) + ' after confirmation.'
        : '5% platform fee. 95% goes to the campaign after admin confirms the GCash ref.';
    };

    feeNote.addEventListener('input', paint);
    tipWrap.querySelector('input').addEventListener('input', paint);
  }
})();
