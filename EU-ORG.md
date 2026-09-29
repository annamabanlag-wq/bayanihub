# Claim bayanihub.eu.org (free)

Checked 2026-09-29: `bayanihub.eu.org` has no NS/A records, so it looks free.
This is not instant. Volunteers approve by email. Cost is $0. No renewal fee.

I cannot finish the form for you. EU.org needs your name, a non-Gmail inbox, and a password.

## Do this in order

### 1. Use a non-Gmail email
Gmail blocks EU.org validation mail as spam. Use Proton, Outlook, Yahoo, or similar.
Form: https://nic.eu.org/arf/en/contact/create/

Tick **Private (not shown in the public Whois)**.
Accept the policy. Save the handle they give you (it ends in `-FREE`).

### 2. Create free DNS *before* you request the domain
EU.org only accepts nameservers, not GitHub A records.

Recommended: https://desec.io (free)
1. Sign up
2. Add domain `bayanihub.eu.org`
3. Create records:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | annamabanlag-wq.github.io |

Nameservers to paste in EU.org:
- `ns1.desec.io`
- `ns2.desec.org`

### 3. Request the domain
Login: https://nic.eu.org/arf/en/
New domain: `bayanihub.eu.org`
Choose server names / NS and enter the two deSEC servers above.

If they reject a direct `.eu.org` name, request `bayanihub.us.eu.org` instead (US.eu.org is an open zone). There is no PH.eu.org zone.

### 4. Wait for the approval email
Usually a few days. Check spam.

### 5. Attach it to GitHub Pages
On **annamabanlag-wq.github.io** (user site):
Settings → Pages → Custom domain → `bayanihub.eu.org` → Enforce HTTPS

Then add a `CNAME` file in that repo containing only:

```
bayanihub.eu.org
```

Do not add the CNAME file until the domain is approved.

## After it works
Share: https://bayanihub.eu.org
Old GitHub URL can stay as backup.
