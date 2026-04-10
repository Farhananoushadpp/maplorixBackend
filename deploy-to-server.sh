#!/bin/bash

# Maplorix Backend Deployment Script
# Run this script on the production server: 159.198.76.95

echo "=========================================="
echo "  Maplorix Backend Deployment Script"
echo "  Server: 159.198.76.95"
echo "=========================================="

# Set variables
BACKEND_DIR="/var/www/maplorix-backend"
SERVICE_NAME="maplorix-backend"
BACKUP_DIR="/var/backups/maplorix-backend"

echo "1. Creating backup of current deployment..."
if [ -d "$BACKEND_DIR" ]; then
    sudo mkdir -p $BACKUP_DIR
    sudo cp -r $BACKEND_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
    echo "   Backup created successfully"
else
    echo "   No existing installation found"
fi

echo "2. Setting up backend directory..."
sudo mkdir -p $BACKEND_DIR
cd $BACKEND_DIR

echo "3. Pulling latest code from repository..."
if [ -d ".git" ]; then
    sudo git pull origin master
else
    sudo git clone https://github.com/Farhananoushadpp/maplorixBackend.git .
fi

echo "4. Installing dependencies..."
sudo npm install --production

echo "5. Setting up environment configuration..."
if [ ! -f ".env" ]; then
    sudo cp .env.production .env
    echo "   Production environment configured"
else
    echo "   Environment file already exists"
fi

echo "6. Setting up PM2 process management..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo "   PM2 installed globally"
fi

echo "7. Creating PM2 ecosystem file..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'maplorix-backend',
    script: 'deploy-production.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

echo "8. Creating logs directory..."
sudo mkdir -p logs

echo "9. Starting application with PM2..."
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup

echo "10. Setting up Nginx reverse proxy..."
sudo apt-get update
sudo apt-get install -y nginx

cat > /etc/nginx/sites-available/maplorix-backend << EOF
server {
    listen 80;
    server_name 159.198.76.95;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # File upload size limit
    client_max_body_size 10M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

echo "11. Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/maplorix-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "12. Setting up SSL certificate (optional)..."
# sudo apt-get install -y certbot python3-certbot-nginx
# sudo certbot --nginx -d your-domain.com

echo "13. Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "14. Final deployment check..."
echo "   Checking if backend is running..."
sleep 5

if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo "   Backend is running successfully!"
else
    echo "   Backend may not be running properly. Check logs with: pm2 logs maplorix-backend"
fi

echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo "Backend URL: http://159.198.76.95"
echo "API Health: http://159.198.76.95/health"
echo "API Docs:   http://159.198.76.95/api"
echo ""
echo "Useful Commands:"
echo "  View logs:     pm2 logs maplorix-backend"
echo "  Restart:       pm2 restart maplorix-backend"
echo "  Stop:          pm2 stop maplorix-backend"
echo "  Monitor:       pm2 monit"
echo "  Nginx status:  sudo systemctl status nginx"
echo "=========================================="
