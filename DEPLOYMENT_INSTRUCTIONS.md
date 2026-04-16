# Maplorix Backend Deployment Instructions

## **Server: 159.198.76.95**

### **Quick Deployment Steps**

#### **1. Connect to Server**
```bash
ssh root@159.198.76.95
```

#### **2. Download and Run Deployment Script**
```bash
# Download the deployment script
wget https://raw.githubusercontent.com/Farhananoushadpp/maplorixBackend/master/deploy-to-server.sh

# Make it executable
chmod +x deploy-to-server.sh

# Run the deployment
./deploy-to-server.sh
```

### **Manual Deployment Steps**

If the automated script fails, follow these manual steps:

#### **1. Update System**
```bash
apt-get update && apt-get upgrade -y
```

#### **2. Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

#### **3. Install PM2**
```bash
npm install -g pm2
```

#### **4. Install Nginx**
```bash
apt-get install -y nginx
```

#### **5. Clone Repository**
```bash
cd /var/www
git clone https://github.com/Farhananoushadpp/maplorixBackend.git maplorix-backend
cd maplorix-backend
```

#### **6. Install Dependencies**
```bash
npm install --production
```

#### **7. Configure Environment**
```bash
cp .env.production .env
# Edit .env with your actual production values
nano .env
```

#### **8. Start Application**
```bash
pm2 start deploy-production.js --name maplorix-backend
pm2 save
pm2 startup
```

#### **9. Configure Nginx**
```bash
# Create nginx config
nano /etc/nginx/sites-available/maplorix-backend
```

Add this content:
```nginx
server {
    listen 80;
    server_name 159.198.76.95;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

#### **10. Enable Site**
```bash
ln -sf /etc/nginx/sites-available/maplorix-backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx
```

#### **11. Setup Firewall**
```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
```

### **Environment Configuration**

Update `.env` file with actual production values:

```env
NODE_ENV=production
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maplorix

# JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
EMAIL_FROM=noreply@maplorix.com

# File Upload
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=https://maplorix.ae

# Security
BCRYPT_ROUNDS=12
```

### **Verification**

#### **Check if Backend is Running**
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs maplorix-backend

# Test API endpoints
curl http://localhost:4000/health
curl http://localhost:4000/api/jobs
```

#### **Check Nginx**
```bash
# Check nginx status
systemctl status nginx

# Test nginx configuration
nginx -t

# Check nginx logs
tail -f /var/log/nginx/error.log
```

### **Useful Commands**

#### **PM2 Commands**
```bash
pm2 list                 # List all processes
pm2 logs maplorix-backend # View logs
pm2 restart maplorix-backend # Restart
pm2 stop maplorix-backend    # Stop
pm2 delete maplorix-backend  # Delete
pm2 monit               # Monitor dashboard
```

#### **Nginx Commands**
```bash
systemctl status nginx  # Check status
systemctl restart nginx # Restart
systemctl reload nginx  # Reload config
nginx -t               # Test configuration
```

#### **Git Commands**
```bash
git pull origin master # Pull latest changes
pm2 restart maplorix-backend # Restart after update
```

### **Access URLs**

- **Backend API**: http://159.198.76.95
- **Health Check**: http://159.198.76.95/health
- **API Documentation**: http://159.198.76.95/api
- **Jobs API**: http://159.198.76.95/api/jobs
- **Auth API**: http://159.198.76.95/api/auth

### **Troubleshooting**

#### **Common Issues**

1. **Port 4000 not accessible**
   - Check if PM2 process is running: `pm2 status`
   - Check logs: `pm2 logs maplorix-backend`
   - Restart: `pm2 restart maplorix-backend`

2. **Nginx 502 Bad Gateway**
   - Check if backend is running on port 4000
   - Check nginx configuration: `nginx -t`
   - Restart nginx: `systemctl restart nginx`

3. **Database Connection Error**
   - Check MongoDB URI in `.env` file
   - Verify database credentials
   - Check network connectivity

4. **Permission Denied**
   - Check file permissions: `ls -la`
   - Fix permissions: `chown -R www-data:www-data /var/www/maplorix-backend`

#### **Logs Location**
- **PM2 Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **Application Logs**: `/var/www/maplorix-backend/logs/`

### **Security Recommendations**

1. **Setup SSL Certificate**
   ```bash
   apt-get install -y certbot python3-certbot-nginx
   certbot --nginx -d your-domain.com
   ```

2. **Configure Firewall**
   ```bash
   ufw allow ssh
   ufw allow 'Nginx Full'
   ufw enable
   ```

3. **Regular Updates**
   ```bash
   apt-get update && apt-get upgrade -y
   ```

4. **Backup Strategy**
   - Regular database backups
   - Code repository backups
   - Configuration backups

### **Monitoring**

#### **System Monitoring**
```bash
# Check system resources
htop
df -h
free -h

# Check application status
pm2 monit
pm2 status
```

#### **Log Monitoring**
```bash
# Real-time log monitoring
tail -f ~/.pm2/logs/maplorix-backend-out.log
tail -f ~/.pm2/logs/maplorix-backend-error.log
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## **Deployment Status**

- [ ] Code pushed to GitHub
- [ ] Server access configured
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Application running
- [ ] Nginx configured
- [ ] Firewall setup
- [ ] SSL certificate (optional)
- [ ] Monitoring configured

**Last Updated**: $(date)
