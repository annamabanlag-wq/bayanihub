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
| Help-request posting + follow-up | Free | BayaniHub |
| Featured campaign advertising, 7 days | ₱199 | BayaniHub |
| Homepage sponsor, 7 days | ₱499 | BayaniHub |
| Homepage sponsor, 30 days | ₱1,499 | BayaniHub |

Receive number already in the app: `09381447214`.

Sponsor/advertising payments are submitted to Supabase and remain pending until admin confirms the GCash reference in `admin.html`. Confirmed advertising rows land in the cloud revenue ledger. Help requests themselves are free.

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

## Payment flow

BayaniHub is prepared for automatic GCash WebPay payments. The public app is designed to send each payment request to a secure Supabase Edge Function; GCash merchant secrets stay on the backend, never in GitHub or browser code.

Automatic mode is activated only after BayaniHub has an approved GCash for Business/WebPay merchant integration and the production credentials are stored as backend secrets. The payment provider then returns a verified payment result to BayaniHub's secure webhook.

Until that onboarding is complete, the existing manual GCash verification flow remains the fallback. Confirmed gifts use the 5% platform fee, and confirmed advertising/sponsor payments are recorded as BayaniHub platform revenue.

## EmailJS
Point templates at **hello@bayanihub.org**. Replace placeholders in `campaign.html` and `submit.html`:

- `YOUR_EMAILJS_PUBLIC_KEY`
- `YOUR_SERVICE_ID`
- `YOUR_TEMPLATE_DONATION` / `YOUR_TEMPLATE_CAMPAIGN`

Built with bayanihan spirit. Not affiliated with any government.
