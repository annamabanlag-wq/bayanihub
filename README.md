# BayaniHub – Tulong para sa Pilipino

Premium mobile-first Progressive Web App (PWA) for community fundraising in the Philippines.

## Features
- **Discover** – Search + category filters (Medical, Disability, Family, Bereavement, Pet, Education, Environment, Community, Hospital)
- **Campaign detail** – Story, progress, donor count, verified badge, **real scannable GCash QR**, evidence previews
- **Submit campaign** – Form + **required evidence upload** (photos/documents) → pending admin review
- **User dashboard** – My campaigns & donation notifications
- **Admin Command Center** – Approve/reject, view uploaded evidence, verification badges, urgent flag, donation list
- **Privacy Policy** page
- **Email notifications** via EmailJS to annamabanlag@gmail.com
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

**GCash number (pre-filled):** `09381447214`

## Email Notifications (EmailJS)

Notifications for new campaigns and donations are sent to **annamabanlag@gmail.com**.

### Setup (5–10 minutes)

1. Go to https://www.emailjs.com and create a free account (use your Gmail).
2. **Email Services** → Add New Service → choose **Gmail** → connect your Google account.
3. **Email Templates** → Create two templates:

   **Template 1 – New Donation**
   - Name: `donation_notify`
   - Subject: `[BayaniHub] New donation {{amount}} – {{campaign_title}}`
   - Body:
     ```
     New donation received

     Campaign: {{campaign_title}}
     Donor: {{donor_name}}
     Amount: {{amount}}
     GCash Ref: {{gcash_ref}}
     Date: {{date}}

     Please verify on GCash 09381447214 and release funds if confirmed.
     ```

   **Template 2 – New Campaign**
   - Name: `campaign_notify`
   - Subject: `[BayaniHub] New campaign pending – {{campaign_title}}`
   - Body:
     ```
     New campaign submitted for review

     Title: {{campaign_title}}
     Organizer: {{organizer}}
     Location: {{location}}
     Goal: {{goal}}
     Contact: {{contact}}
     Evidence files: {{evidence_count}}

     Please log in to Admin Command Center to review.
     ```

4. Copy these three values:
   - **Public Key** (Account → General)
   - **Service ID** (Email Services)
   - **Template ID** for each template

5. Open `campaign.html` and `submit.html` and replace:
   ```
   YOUR_EMAILJS_PUBLIC_KEY
   YOUR_SERVICE_ID
   YOUR_TEMPLATE_DONATION   (or YOUR_TEMPLATE_CAMPAIGN)
   ```
   with your real values.

After that, every donation and new campaign will automatically email **annamabanlag@gmail.com**.

Free tier = 200 emails/month (more than enough to start).

## Deploy (Free)

### Option 1 – Cloudflare Pages (recommended – unlimited bandwidth, commercial OK)
1. Create free account at https://pages.cloudflare.com
2. Connect GitHub repo or drag-and-drop the `bayanihub` folder
3. Deploy → get free `*.pages.dev` URL

### Option 2 – Netlify (commercial OK)
1. Go to https://app.netlify.com/drop
2. Drag the entire `bayanihub` folder
3. Instant free `*.netlify.app` URL

### Option 3 – GitHub Pages
1. Repo → Settings → Pages → Deploy from main branch

Built with bayanihan spirit. Not affiliated with any government.
