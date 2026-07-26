#!/bin/bash
# Installs a self-removing cron job that tries to issue the HTTPS certificate
# every 30 minutes until DNS for produceevent.ru points to this server.
set -e

cat > /root/certbot-try.sh <<'SCRIPT'
#!/bin/bash
# Try apex+www first; fall back to apex only (in case www record is missing).
if certbot --nginx -d produceevent.ru -d www.produceevent.ru \
     --non-interactive --agree-tos -m dglushakov@gmail.com --redirect \
   || certbot --nginx -d produceevent.ru \
     --non-interactive --agree-tos -m dglushakov@gmail.com --redirect; then
  echo "$(date): HTTPS issued, removing cron"
  rm -f /etc/cron.d/certbot-produceevent
else
  echo "$(date): DNS not ready yet, will retry"
fi
SCRIPT
chmod +x /root/certbot-try.sh

cat > /etc/cron.d/certbot-produceevent <<'CRON'
*/30 * * * * root /root/certbot-try.sh >> /var/log/certbot-produceevent.log 2>&1
CRON

echo "HTTPS auto-retry installed (every 30 min). Log: /var/log/certbot-produceevent.log"
# Run once right away in case DNS is already live:
/root/certbot-try.sh || true
