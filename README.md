# BayaniHub

Community fundraising PWA for Filipinos in need.

Brand name: **BayaniHub**. Inbox: hello@bayanihub.org (configure in EmailJS).

Live app: https://annamabanlag-wq.github.io/bayanihub/

## How it makes money

Manual GCash only. Nothing is marked paid until staff confirms the reference number in the control center.

| Line | Price | Who keeps it |
| --- | --- | --- |
| Platform fee on a confirmed gift | 5% | BayaniHub |
| Gift after the fee | 95% | Campaign organizer |
| Optional donor tip | Donor chooses | BayaniHub |
| Concierge post + follow-up | ₱50 | BayaniHub |
| Campaign boost, 7 days | ₱199 | BayaniHub |
| Homepage sponsor, 7 days | ₱499 | BayaniHub |
| Homepage sponsor, 30 days | ₱1,499 | BayaniHub |

Receive number already in the app: `09381447214`.

Sponsor page: `sponsor.html`. Admin confirms gifts and sponsors in `admin.html` (demo password `bayaniadmin`). Confirmed rows land in the local revenue ledger.

Sample campaigns on Discover are demo stories so the app is not empty. Their raised totals are not collected money. Only confirmed GCash references are platform revenue.

## Features
- Discover campaigns with category filters
- Campaign detail with GCash QR and evidence previews
- Submit a campaign (evidence required, admin review)
- User dashboard
- Admin Command Center with revenue totals
- Privacy policy
- Email alerts via EmailJS to the BayaniHub inbox
- Sponsor slots + GCash manual approval
- Installable PWA

## GCash flow
1. Campaign page shows a scannable QR and the GCash number
2. Donor pays in GCash and puts the campaign title/ID in the message
3. Donor pastes the GCash reference number in the app
4. Admin confirms the transfer, the 5% fee is recorded, and the organizer share is added to the campaign

## EmailJS
Point templates at **hello@bayanihub.org**. Replace placeholders in `campaign.html` and `submit.html`:

- `YOUR_EMAILJS_PUBLIC_KEY`
- `YOUR_SERVICE_ID`
- `YOUR_TEMPLATE_DONATION` / `YOUR_TEMPLATE_CAMPAIGN`

Built with bayanihan spirit. Not affiliated with any government.
