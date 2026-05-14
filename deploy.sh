#!/bin/bash
# ============================================================
# SHSH Panel — Deploy / Update Script
# Use this to update an existing installation.
# For FIRST TIME setup, use: bash setup.sh
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

[ "$(id -u)" -ne 0 ] && echo -e "${RED}Run as root${NC}" && exit 1

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="/tmp/shsh-deploy.log"
> "$LOG"

echo -e "${CYAN}=== SHSH Panel — Update Deploy ===${NC}"
echo ""

# Copy updated files
echo -e "${CYAN}[1/4]${NC} Copying files..."
cp -R "$SCRIPT_DIR/shsh-panel/src" /opt/shsh-panel/src
cp -R "$SCRIPT_DIR/shsh-panel/prisma" /opt/shsh-panel/prisma
cp -R "$SCRIPT_DIR/shsh-panel/site/app" /opt/shsh-panel/site/app
cp -R "$SCRIPT_DIR/shsh-panel/site/public" /opt/shsh-panel/site/public 2>/dev/null || true
for dir in "$SCRIPT_DIR"/banks/*/; do
  bank=$(basename "$dir")
  if [ -d "/opt/banks/$bank" ]; then
    rsync -a --exclude='node_modules' --exclude='.next' --exclude='.env' "$dir" "/opt/banks/$bank/"
  else
    cp -R "$dir" "/opt/banks/$bank"
  fi
done
echo -e "${GREEN}[+]${NC} Files copied"

# Rebuild
echo -e "${CYAN}[2/4]${NC} Building panel..."
cd /opt/shsh-panel && npx prisma generate >> "$LOG" 2>&1 && npm run build >> "$LOG" 2>&1
echo -e "${GREEN}[+]${NC} Panel built"

echo -e "${CYAN}[3/4]${NC} Building site + banks..."
cd /opt/shsh-panel/site && npm run build >> "$LOG" 2>&1
for dir in /opt/banks/*/; do
  cd "$dir" && npm run build >> "$LOG" 2>&1
done
echo -e "${GREEN}[+]${NC} All built"

# Restart
echo -e "${CYAN}[4/4]${NC} Restarting..."
pm2 restart all >> "$LOG" 2>&1
echo -e "${GREEN}[+]${NC} Done! $(pm2 list --no-color 2>/dev/null | grep -c online) processes online"
echo ""
echo "Logs: pm2 logs | cat $LOG"
