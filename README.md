# BayaniHub – Tulong para sa Pilipino

Premium mobile-first Progressive Web App (PWA) for community fundraising in the Philippines.

## Features
- **Discover** – Search + category filters (Medical, Disability, Family, Bereavement, Pet, Education, Environment, Community, Hospital)
- **Campaign detail** – Story, progress, donor count, verified badge, **real scannable GCash QR**, evidence previews
- **Submit campaign** – Form + **required evidence upload** (photos/documents) → pending admin review
- **User dashboard** – My campaigns & donation notifications
- **Admin Command Center** – Approve/reject, view uploaded evidence, verification badges, urgent flag, donation list
- **Privacy Policy** page
- **Monetization** – Sponsor/ad slots + GCash manual approval
- **PWA** – Installable on Android, offline-capable

## Demo Admin Password
`bayaniadmin`

## How real GCash works (QR + manual)
1. Campaign page shows a **scannable QR** generated from the GCash number + the number itself
2. Donor opens GCash → Scan QR or Send Money
3. Puts campaign title/ID in the message
4. Pastes the GCash Reference No. in the app and notifies admin
5. Admin verifies the real transfer and releases funds to the beneficiary

**Important:** Replace every `09XX-XXX-XXXX` with your real GCash number in `js/data.js`. Change admin password in `admin.html`. QR is generated live from the number you set.

## Deploy (Free)

### Option 1 – Cloudflare Pages (recommended – unlimited bandwidth, commercial OK)
1. Create free account at https://pages.cloudflare.com
2. Connect GitHub repo or drag-and-drop the `bayanihub` folder
3. Deploy → get free `*.pages.dev` URL (no personal name needed)

### Option 2 – Netlify (commercial OK)
1. Go to https://app.netlify.com/drop
2. Drag the entire `bayanihub` folder
3. Instant free `*.netlify.app` URL

### Option 3 – GitHub Pages
1. Push this folder to a public repo
2. Settings → Pages → Deploy from main branch
3. Site at `https://YOURUSERNAME.github.io/REPO`

## Customize
- Change GCash number & contact emails
- Replace seed campaigns in `js/data.js`
- Update sponsor email links
- Add real backend later (Supabase / Firebase free tier) for multi-device persistence

Built with bayanihan spirit. Not affiliated with any government.
