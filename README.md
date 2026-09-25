# BayaniHub – Tulong para sa Pilipino

Premium mobile-first Progressive Web App (PWA) for community fundraising in the Philippines.

## Features
- **Discover** – Search + category filters (Medical, Disability, Family, Bereavement, Pet, Education, Environment, Community, Hospital)
- **Campaign detail** – Story, progress bar, donor count, verified badge, GCash donate flow
- **Submit campaign** – Form → pending admin review
- **User dashboard** – My campaigns & donation notifications
- **Admin Command Center** – Approve/reject, verification badges, urgent flag, donation list
- **Monetization** – Sponsor/ad slots on key pages + GCash manual approval
- **PWA** – Installable on Android, offline-capable, app-like experience

## Demo Admin Password
`bayaniadmin`

## How GCash works (manual)
1. Donor sends money to the GCash number shown on the campaign
2. Donor submits reference number in the app
3. Admin sees notification in Command Center
4. Admin verifies the actual GCash transaction
5. Admin releases / transfers to the beneficiary

**Important:** Update the GCash number in `js/data.js` (seed) and/or in the campaign objects. Change admin password in `admin.html`.

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
