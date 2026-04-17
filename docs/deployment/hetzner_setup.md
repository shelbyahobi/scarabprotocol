# SCARAB Protocol — Hetzner Cloud Deployment Guide

**Target:** Hetzner Cloud CX21 VPS · Frankfurt (eu-central) · €4.51/month
**Why Hetzner:** German company, GDPR-native by default, ISO 27001 certified, no US data transfer. This is the single strongest technical argument for German municipal procurement.

## Prerequisites
- Hetzner Cloud account with SSH key configured
- Domain `scarabprotocol.org` pointed to Hetzner VPS IP
- `.env.production` file with all required secrets

## 1. Provision the Server

```bash
# Via Hetzner Cloud Console or hcloud CLI
hcloud server create \
  --name scarab-prod \
  --type cx21 \
  --image ubuntu-22.04 \
  --location fsn1 \
  --ssh-key your-key-name
```

**Specs:** 2 vCPU, 4GB RAM, 40GB NVMe SSD — sufficient for Redis + Node.js + Nginx.

## 2. Initial Server Setup

```bash
ssh root@YOUR_HETZNER_IP

# System updates
apt update && apt upgrade -y

# Install Docker + Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
apt install docker-compose-plugin -y

# Create application user
adduser --disabled-password scarab
usermod -aG docker scarab

# Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 3. Deploy Application

```bash
su - scarab
git clone https://github.com/shelbyahobi/scarabprotocol.git
cd scarabprotocol

# Copy production environment
cp .env.example .env.production
nano .env.production  # Fill in all required secrets

# Build and launch
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## 4. SSL Certificate (Let's Encrypt)

```bash
# Initial certificate generation
docker compose -f docker-compose.prod.yml run --rm certbot \
  certbot certonly --webroot --webroot-path=/var/www/certbot \
  -d scarabprotocol.org -d www.scarabprotocol.org \
  --email admin@scarabprotocol.org --agree-tos --non-interactive

# Restart nginx to pick up certs
docker compose -f docker-compose.prod.yml restart frontend
```

## 5. Verify Deployment

```bash
# Health check
curl http://localhost:3001/health
# Expected: {"status":"ok","worker":"scarab-oracle-api"}

# Redis connectivity
docker compose exec redis redis-cli -a $REDIS_PASSWORD ping
# Expected: PONG

# Public aggregate endpoint
curl https://scarabprotocol.org/api/data/aggregate
```

## 6. Monitoring & Maintenance

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f backend

# Restart services
docker compose -f docker-compose.prod.yml restart

# Update deployment
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## GDPR Compliance Checklist

| Requirement | Status |
|---|---|
| Data processed in EU | ✅ Hetzner Frankfurt (fsn1) |
| No US data transfer | ✅ No AWS/GCP dependencies for user data |
| Encryption at rest | ✅ Redis AOF on encrypted NVMe |
| Encryption in transit | ✅ Let's Encrypt TLS 1.3 |
| Data minimisation | ✅ Only hashed device IDs on-chain |
| Right to erasure | ✅ Redis keys deletable per jurisdiction |
| DPA available | ✅ Hetzner provides standard DPA |

## Cost Summary

| Service | Monthly Cost |
|---|---|
| Hetzner CX21 VPS | €4.51 |
| Domain (annual/12) | ~€1.00 |
| Let's Encrypt SSL | Free |
| **Total** | **~€5.51/month** |

This is 97% cheaper than equivalent AWS eu-central-1 infrastructure and carries a significantly stronger GDPR narrative for German municipal procurement.
