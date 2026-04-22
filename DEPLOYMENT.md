# Deployment Guide - Prescription OCR

## 🚀 Production Deployment

This guide covers deploying the Prescription OCR application to various platforms.

---

## Deployment Options

### 1. Local/Self-Hosted Server

#### Requirements
- Python 3.8+
- Node.js 16+
- 2GB RAM minimum
- 1GB storage minimum

#### Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m gunicorn app:app --workers 4 --bind 0.0.0.0:5000
```

**Frontend:**
```bash
cd frontend
npm run build
npm install -g serve
serve -s dist -l 5173
```

Or use nginx as reverse proxy (recommended).

---

### 2. Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Backend Deployment

1. **Create Procfile:**
```bash
cd backend
echo "web: gunicorn app:app" > Procfile
echo "gunicorn==21.2.0" >> requirements.txt
```

2. **Deploy:**
```bash
heroku create prescription-ocr-backend
heroku config:set GROQ_API_KEY=your_api_key_here
git push heroku main
```

#### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy dist folder to Netlify or Vercel
```

---

### 3. Docker & Docker Compose

#### Dockerfile (Backend)

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')"

# Run application
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "4"]
```

#### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - GROQ_MODEL=llama-3.3-70b-versatile
      - FLASK_ENV=production
      - FLASK_DEBUG=False
    volumes:
      - ./backend/uploads:/app/uploads
    restart: always
    networks:
      - prescription-ocr

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:5000
    depends_on:
      - backend
    restart: always
    networks:
      - prescription-ocr

networks:
  prescription-ocr:
    driver: bridge
```

#### Run with Docker Compose

```bash
# Set environment variables
export GROQ_API_KEY=your_api_key_here

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

### 4. Kubernetes Deployment

#### Backend Deployment YAML

Create `k8s/backend-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prescription-ocr-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: prescription-ocr-backend
  template:
    metadata:
      labels:
        app: prescription-ocr-backend
    spec:
      containers:
      - name: backend
        image: your-registry/prescription-ocr-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: GROQ_API_KEY
          valueFrom:
            secretKeyRef:
              name: groq-credentials
              key: api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: prescription-ocr-backend-service
spec:
  selector:
    app: prescription-ocr-backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
  type: LoadBalancer
```

#### Deploy to Kubernetes

```bash
# Create secret
kubectl create secret generic groq-credentials \
  --from-literal=api-key=your_api_key_here

# Apply deployment
kubectl apply -f k8s/backend-deployment.yaml

# Check status
kubectl get deployments
kubectl get services
```

---

### 5. AWS Deployment

#### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p python-3.10 prescription-ocr

# Create environment
eb create prescription-ocr-env

# Set environment variables
eb setenv GROQ_API_KEY=your_api_key_here GROQ_MODEL=llama-3.3-70b-versatile

# Deploy
eb deploy

# Open application
eb open
```

#### Using EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install dependencies:
```bash
sudo apt update
sudo apt install python3-pip python3-venv nodejs npm
```

4. Clone repository and setup:
```bash
git clone <repo-url>
cd project
bash setup.sh
```

5. Configure systemd service for backend:
```bash
sudo nano /etc/systemd/system/prescription-ocr.service
```

```ini
[Unit]
Description=Prescription OCR Backend
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/project/backend
Environment="PATH=/home/ubuntu/project/backend/venv/bin"
ExecStart=/home/ubuntu/project/backend/venv/bin/gunicorn app:app --workers 4 --bind 0.0.0.0:5000
Restart=always

[Install]
WantedBy=multi-user.target
```

6. Enable and start service:
```bash
sudo systemctl enable prescription-ocr
sudo systemctl start prescription-ocr
```

---

### 6. Azure Deployment

#### Using App Service

```bash
# Create resource group
az group create --name prescription-ocr --location eastus

# Create App Service Plan
az appservice plan create \
  --name prescription-ocr-plan \
  --resource-group prescription-ocr \
  --sku P1V2 --is-linux

# Create Web App
az webapp create \
  --resource-group prescription-ocr \
  --plan prescription-ocr-plan \
  --name prescription-ocr-app \
  --runtime "PYTHON|3.10"

# Set environment variables
az webapp config appsettings set \
  --resource-group prescription-ocr \
  --name prescription-ocr-app \
  --settings GROQ_API_KEY=your_api_key_here

# Deploy
az webapp up \
  --resource-group prescription-ocr \
  --name prescription-ocr-app
```

---

### 7. Railway.app Deployment

1. Create account at railway.app
2. Connect GitHub repository
3. Create new project
4. Add environment variable: `GROQ_API_KEY=your_key`
5. Railway will auto-detect and deploy

---

### 8. Vercel + Backend Proxy

**Frontend on Vercel:**
```bash
cd frontend
npm install -g vercel
vercel deploy
```

**Backend proxy to Heroku/Railway**

---

## Production Configuration

### Environment Variables

Create `.env.production`:
```bash
# Backend
GROQ_API_KEY=your_production_key
GROQ_MODEL=llama-3.3-70b-versatile
FLASK_ENV=production
FLASK_DEBUG=False
FLASK_PORT=5000
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set strong CORS origins
- [ ] Implement rate limiting
- [ ] Add API authentication
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable security headers
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

### Performance Optimization

1. **Backend:**
   - Use gunicorn with multiple workers
   - Enable caching
   - Use CDN for static files
   - Optimize PaddleOCR model

2. **Frontend:**
   - Enable gzip compression
   - Minify and bundle assets
   - Use CDN for static files
   - Lazy load components

3. **Infrastructure:**
   - Use load balancer
   - Enable auto-scaling
   - Set up monitoring
   - Use database connection pooling

---

## Monitoring & Logging

### Application Monitoring

```python
# Add to backend/app.py
from flask import Flask
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Add error tracking (e.g., Sentry)
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

### Log Aggregation

Set up ELK Stack, Datadog, or similar for log aggregation and analysis.

---

## Backup & Recovery

1. **Upload Storage:** Back up `backend/uploads/` regularly
2. **Database:** If added, implement database backups
3. **Code:** Use Git with regular commits
4. **Disaster Recovery Plan:** Document and test recovery procedures

---

## Scaling Considerations

- Load balance multiple backend instances
- Use caching (Redis) for OCR results
- Database optimization if adding user data
- CDN for frontend assets
- Auto-scaling based on CPU/memory

---

## Cost Estimation

### Groq API
- ~$0.10 per 1M input tokens
- Typical prescription: ~500 tokens = $0.00005
- 1000 prescriptions/day = ~$0.05/day

### Hosting
- Docker/EC2: $10-50/month
- Heroku Dyno: $7-50/month
- Kubernetes: $50-200+/month
- Serverless (Lambda): $0.20 per million requests

---

## Troubleshooting Deployment

### Application won't start
- Check logs
- Verify environment variables
- Test locally first

### API calls timeout
- Increase timeout settings
- Check OCR image size
- Monitor Groq API status

### High memory usage
- Optimize model caching
- Limit concurrent requests
- Use lighter models

### CORS errors
- Verify frontend URL in CORS_ORIGINS
- Check HTTP vs HTTPS
- Restart application

---

## Support & Resources

- [Flask Deployment](https://flask.palletsprojects.com/deployment/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Groq API Documentation](https://console.groq.com/docs)

---

Next Steps:
1. Choose deployment platform
2. Set up monitoring
3. Configure backups
4. Test thoroughly
5. Monitor performance
6. Plan scaling strategy
