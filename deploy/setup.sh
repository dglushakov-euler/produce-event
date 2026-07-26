#!/bin/bash
# One-shot server setup for produceevent.ru (run as root on the VPS).
# Usage: curl -sL <raw-url> | TG_TOKEN='...' TG_CHAT='...' bash
set -e

echo "=== [1/6] SSH keys ==="
mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
grep -qF 'claude-deploy@dglus' ~/.ssh/authorized_keys || \
  echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII/gqMkP9anSKFrkM1WT/neKKp/StALmZDo5+xNnTXXc claude-deploy@dglus' >> ~/.ssh/authorized_keys
grep -qF 'gh-actions-produce-event' ~/.ssh/authorized_keys || \
  echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ5Ij2JxTgaUkH9UJFT2pfcY6l3zZBGAlbwFaudFMI3S gh-actions-produce-event' >> ~/.ssh/authorized_keys

echo "=== [2/6] Clone / update repo ==="
cd ~
if [ ! -d produce-event ]; then
  git clone https://github.com/dglushakov-euler/produce-event.git
fi
cd produce-event
git pull

echo "=== [3/6] Env file ==="
if [ -n "$TG_TOKEN" ] && [ -n "$TG_CHAT" ]; then
  printf "TELEGRAM_BOT_TOKEN=%s\nTELEGRAM_CHAT_ID=%s\n" "$TG_TOKEN" "$TG_CHAT" > .env
  echo ".env written"
elif [ ! -f .env ]; then
  echo "WARNING: no .env and no TG_TOKEN/TG_CHAT passed — form will not send to Telegram"
  touch .env
fi

echo "=== [4/6] Docker pull & run (port 8002) ==="
docker builder prune -af >/dev/null 2>&1 || true
docker compose pull
docker compose up -d

echo "=== [5/6] Nginx ==="
cat > /etc/nginx/sites-available/produce-event <<'NGINX'
server {
    listen 80;
    server_name produceevent.ru www.produceevent.ru;
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/produce-event /etc/nginx/sites-enabled/produce-event
nginx -t && systemctl reload nginx

echo "=== [6/6] HTTPS (needs DNS pointing here) ==="
if certbot --nginx -d produceevent.ru -d www.produceevent.ru \
     --non-interactive --agree-tos -m dglushakov@gmail.com --redirect; then
  echo "HTTPS OK"
else
  echo "CERTBOT DEFERRED — DNS not ready yet. Re-run later:"
  echo "  certbot --nginx -d produceevent.ru -d www.produceevent.ru --non-interactive --agree-tos -m dglushakov@gmail.com --redirect"
fi

echo ""
echo "=========================================="
docker compose ps
curl -s -o /dev/null -w "Local site answers: HTTP %{http_code}\n" http://localhost:8002
echo "SETUP DONE"
