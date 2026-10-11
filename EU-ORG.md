# BAYANIHUB custom domain setup (free option)

Goal: use a branded public address such as bayanihub.eu.org instead of a hosting URL that exposes an account username.

Current official app: https://bayanihub.vercel.app/

## Important status
The domain request and DNS status have not been verified here. Do not tell people to use bayanihub.eu.org until it is approved, connected in Vercel, verified, and loading over HTTPS.

## If the domain request is still needed
1. Use the official EU.org registration portal: https://nic.eu.org/arf/en/ . Registration is subject to approval and can take time.
2. If you proceed, choose the privacy option for public WHOIS where available and use a dedicated project contact email if appropriate.
3. Set up a DNS provider only after checking its current nameserver instructions.
4. Once the domain is approved, open the BAYANIHUB Vercel project → Settings → Domains and add bayanihub.eu.org.
5. Copy the exact DNS records Vercel displays into the DNS provider. Do not use GitHub Pages A records for the Vercel-hosted app.
6. Wait for domain verification and HTTPS, then test the home page, campaign pages, and health assessment.

## Public sharing rule
Until the custom domain is verified, share only:
https://bayanihub.vercel.app/

Avoid using the old GitHub Pages address containing the source-control username in campaign materials. The GitHub repository address remains a project-management URL, not the public website.
