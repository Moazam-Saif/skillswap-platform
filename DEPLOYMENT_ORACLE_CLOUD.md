# 🚀 Deploying SkillSwap to Oracle Cloud VM

This guide covers deploying the SkillSwap Docker Compose application to an Oracle Cloud Virtual Machine.

---

## What You Actually Need

| Component | Do You Need It? | Why/Why Not |
|-----------|-----------------|-------------|
| **Load Balancer** | ❌ Not initially | Only needed for high availability/multiple VMs |
| **Oracle Container Engine (OKE)** | ❌ No | Overkill for single-instance deployment |
| **VM + Docker Compose** | ✅ Yes | Perfect for your use case |
| **Redis** | ✅ Included | Already in your docker-compose |
| **MongoDB Atlas** | ✅ Keep using | Already external, no changes needed |

---

## Step-by-Step Deployment Guide

### 1. Create an Oracle Cloud VM

1. Go to Oracle Cloud Console → Compute → Instances
2. Create a new instance:
   - **Image**: Oracle Linux 8 or Ubuntu 22.04
   - **Shape**: VM.Standard.E2.1.Micro (free tier) or VM.Standard.A1.Flex (ARM, 4 OCPUs free)
   - **Boot Volume**: At least 50GB
   - **Networking**: Create a new VCN or use existing

3. **Download your SSH key** during creation

### 2. Configure Security Rules (Firewall)

In Oracle Cloud Console → Networking → Virtual Cloud Networks → Your VCN → Security Lists:

Add **Ingress Rules**:

| Port | Protocol | Source | Description |
|------|----------|--------|-------------|
| 22 | TCP | 0.0.0.0/0 | SSH |
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |
| 5000 | TCP | 0.0.0.0/0 | Backend API (optional, can proxy via Nginx) |
| 5173 | TCP | 0.0.0.0/0 | Frontend Dev (or use Nginx for production) |

### 3. SSH into Your VM

```bash
# Linux/Mac
ssh -i /path/to/your-key.pem opc@<your-vm-public-ip>

# Windows (PowerShell)
ssh -i C:\path\to\your-key.pem opc@<your-vm-public-ip>
```

### 4. Install Docker & Docker Compose

```bash
# For Oracle Linux 8
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Log out and back in for group changes
exit
# SSH back in

# Verify
docker --version
docker compose version
```

### 5. Clone Your Repository

```bash
# Install git if needed
sudo dnf install -y git

# Clone your repo
cd ~
git clone https://github.com/yourusername/skillswap.git
cd skillswap
```

### 6. Create Environment File

```bash
# Create server/.env
nano server/.env
```

Paste your environment variables. **Important changes for production:**

```env
# Change these for production:
NODE_ENV=production
CLIENT_URL=http://<your-vm-public-ip>:5173   # Or your domain
REDIS_HOST=redis
REDIS_PORT=6379

# Keep these (update with your actual values):
MONGO_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY_DAYS=7
GOOGLE_CLIENT_ID=your_google_client_id
LIGHTCAST_CLIENT_ID=your_lightcast_id
LIGHTCAST_CLIENT_SECRET=your_lightcast_secret
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=your_email@zoho.com
EMAIL_PASS=your_email_password
SENDER_NAME=SkillSwap
SENDER_EMAIL=your_email@zoho.com
PORT=5000
```

### 7. Create Production Docker Compose File

```bash
nano docker-compose.prod.yml
```

```yaml
name: skillswap

services:
  api:
    build:
      context: ./server
      dockerfile: Dockerfile.prod
    platform: linux/amd64
    restart: always
    env_file: ./server/.env
    ports:
      - "5000:5000"
    environment:
      REDIS_HOST: redis
      REDIS_PORT: 6379
      NODE_ENV: production
    networks:
      - skillswap
    depends_on:
      - redis

  frontend:
    build: 
      context: ./client
      dockerfile: Dockerfile.prod
      args:
        VITE_API_URL: http://<your-vm-public-ip>:5000
    platform: linux/amd64
    restart: always
    ports:
      - "80:80"
    networks:
      - skillswap
    depends_on:
      - api
  
  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - skillswap

volumes:
  redis_data:

networks:
  skillswap:
    driver: bridge
```

### 8. Create Production Dockerfiles

**server/Dockerfile.prod:**
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**client/Dockerfile.prod** (with Nginx for serving static files):
```dockerfile
# Build stage
FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set production API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**client/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://api:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9. Deploy!

```bash
# Build and run
docker compose -f docker-compose.prod.yml up --build -d

# Check logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps
```

### 10. Access Your Application

- **Frontend**: `http://<your-vm-public-ip>`
- **API**: `http://<your-vm-public-ip>/api` (proxied through Nginx)

---

## Optional: Add a Domain & SSL

If you want HTTPS (recommended for production):

### 1. Get a Domain
Purchase from Namecheap, GoDaddy, Freenom, etc.

### 2. Point Domain to Your VM's IP
Add an A record in your domain's DNS settings pointing to your VM's public IP.

### 3. Add Certbot for Free SSL

```bash
# Install certbot (Oracle Linux)
sudo dnf install -y certbot python3-certbot-nginx

# Or for Ubuntu:
# sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
```

---

## When Would You Need a Load Balancer?

You'd need a load balancer if:
- You need **high availability** (multiple VMs)
- You're handling **1000+ concurrent users**
- You need **zero-downtime deployments**
- You want to **distribute traffic across regions**

For a skill-swapping app starting out, a single VM is plenty!

---

## Quick Reference Commands

```bash
# View running containers
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# View logs for specific service
docker compose -f docker-compose.prod.yml logs -f api

# Restart all services
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart api

# Pull latest code and redeploy
git pull
docker compose -f docker-compose.prod.yml up --build -d

# Stop everything
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes Redis data)
docker compose -f docker-compose.prod.yml down -v

# Clean up old images
docker system prune -a

# Check disk usage
docker system df
```

---

## Architecture After Deployment

```
┌─────────────────────────────────────────────────────┐
│               Oracle Cloud VM                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │              Docker Compose                   │  │
│  │                                               │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │
│  │  │ Nginx   │──│  API    │──│  Redis  │      │  │
│  │  │ :80/443 │  │  :5000  │  │  :6379  │      │  │
│  │  │(frontend)│  │(Express)│  │         │      │  │
│  │  └─────────┘  └────┬────┘  └─────────┘      │  │
│  │                    │                         │  │
│  └────────────────────┼─────────────────────────┘  │
│                       │                            │
└───────────────────────┼────────────────────────────┘
                        │
                        ▼
              ┌───────────────────┐
              │   MongoDB Atlas   │
              │   (External)      │
              └───────────────────┘
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs api

# Check if port is in use
sudo lsof -i :5000
sudo lsof -i :80
```

### Can't connect to the app
1. Check security list rules in Oracle Cloud Console
2. Check VM's firewall:
   ```bash
   sudo firewall-cmd --list-all
   sudo firewall-cmd --add-port=80/tcp --permanent
   sudo firewall-cmd --add-port=5000/tcp --permanent
   sudo firewall-cmd --reload
   ```

### MongoDB connection issues
- Ensure your MongoDB Atlas cluster allows connections from your VM's IP
- Go to MongoDB Atlas → Network Access → Add IP Address → Add your VM's public IP

### Redis connection issues
```bash
# Check if Redis container is running
docker compose -f docker-compose.prod.yml ps redis

# Check Redis logs
docker compose -f docker-compose.prod.yml logs redis
```

---

## Updating the Application

```bash
# SSH into your VM
ssh -i your-key.pem opc@<your-vm-ip>

# Navigate to project
cd ~/skillswap

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml up --build -d

# Verify everything is running
docker compose -f docker-compose.prod.yml ps
```

---

## Backup Considerations

### Redis Data
Redis data is persisted in a Docker volume. To backup:
```bash
# Create backup directory
mkdir -p ~/backups

# Backup Redis data
docker run --rm -v skillswap_redis_data:/data -v ~/backups:/backup alpine tar czf /backup/redis-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### MongoDB
Your data is in MongoDB Atlas, which has its own backup features. Enable automated backups in the Atlas console.

---

## Cost Estimates (Oracle Cloud)

| Resource | Cost |
|----------|------|
| VM.Standard.E2.1.Micro | **Free** (Always Free tier) |
| VM.Standard.A1.Flex (4 OCPU, 24GB RAM) | **Free** (Always Free tier) |
| Boot Volume (50GB) | **Free** (up to 200GB in Always Free) |
| Outbound Data | **Free** (up to 10TB/month) |

**Total: $0/month** using Always Free tier!

---

## Next Steps

1. ✅ Deploy to Oracle Cloud VM
2. ⬜ Add a custom domain
3. ⬜ Enable HTTPS with Let's Encrypt
4. ⬜ Set up monitoring (optional: Uptime Robot, Grafana)
5. ⬜ Configure automated backups
6. ⬜ Set up CI/CD (optional: GitHub Actions)
