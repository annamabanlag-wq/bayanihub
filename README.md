# BayaniHub

Community-help PWA for Filipinos in need.

Brand name: **BayaniHub**. Inbox: hello@bayanihub.org.

Live app: https://annamabanlag-wq.github.io/bayanihub/

## How it works

BayaniHub lets people request help for free. Campaign donations are also fee-free. Real campaign submissions require evidence and are reviewed by an authorized admin before they can appear as approved campaigns.

Current donation flow:
1. Donor opens an approved real campaign.
2. Donor sends the donation through the approved BayaniHub payment channel and keeps the payment receipt/reference.
3. Donor submits the reference on the campaign page.
4. Admin checks the actual transfer and campaign records.
5. Only a confirmed donation changes the public campaign total.

Sample campaigns are clearly marked as demonstrations. Their amounts are not real money.

## Funding and advertising

| Line | Price | Treatment |
| --- | --- | --- |
| Platform fee on a confirmed gift | 0% | No campaign platform fee |
| Campaign share | 100% | Full confirmed donation goes to the campaign |
| Help-request posting + review | Free | No posting fee |
| Featured campaign advertising, 7 days | ₱199 | Available only through an approved secure checkout |
| Homepage sponsor, 7 days | ₱499 | Available only through an approved secure checkout |
| Homepage sponsor, 30 days | ₱1,499 | Available only through an approved secure checkout |

No personal payment account number is stored in public campaign data. Advertising checkout stays disabled until an approved organizational payment channel is connected.

## Features

- Discover campaigns with category filters
- Campaign detail pages with clear donation and verification steps
- Free campaign submission with evidence required
- User dashboard
- Admin Control Center with campaign, donation, sponsor and revenue review
- Privacy policy
- Installable PWA
- Supabase RLS with admin-only access to private records

## Automatic payments

The repository contains a secure integration point for automatic personal payment account WebPay. Provider credentials and webhook secrets must stay in Supabase backend secrets.

Automatic mode should be enabled only after BayaniHub has an approved organizational payment arrangement and the provider has supplied production credentials. Until then, the working donation path is manual personal payment account with admin verification.

## Contact

For privacy or sponsorship questions, use **hello@bayanihub.org**.

Built with bayanihan spirit. Not affiliated with any government.
