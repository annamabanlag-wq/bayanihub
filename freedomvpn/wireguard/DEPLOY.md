# FreedomVPN WireGuard deployment

Use a Linux VPS with a public IPv4 address. Open UDP 51820, replace `YOUR_VPS_PUBLIC_IP`, then run `docker compose up -d`.

The actual VPN tunnel runs on this VPS; Vercel only hosts the website/control surface.
