# Red Dot

React frontend plus a Node.js API for Red Dot, a Bangladesh advertising film agency. The production stack runs in Docker with PostgreSQL.

## Included

- Agency-style landing page
- Recent works gallery with reel modal
- Full works archive grid
- BTS gallery with linked reel modal
- About page
- Leadership message page
- Creative team page
- Admin login/logout
- Admin dashboard with editable persisted content
- PostgreSQL-backed content storage
- Docker Compose deployment and GitHub Actions delivery

## Tech

- React
- Vite
- React Router
- Node.js
- PostgreSQL
- Docker Compose

## Run

```bash
npm install
npm run lint
npm test
npm run build
```

Copy `.env.example` to `.env`, replace every placeholder value, then start the API and Vite development server in separate terminals:

```bash
npm run server
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:3001`. A local PostgreSQL database must exist with the settings defined in `.env`.

## Admin credentials

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` in your local `.env` file before starting the API. These values are never committed to the repository.

## Notes

- Content is stored in MySQL by the Node.js backend.
- Admin authentication is handled by backend-issued bearer tokens.
- Production secrets should be set from environment variables instead of defaults.
- On EC2, run the Node API on an internal port such as `3001` and proxy `/api` through Nginx.
- On first boot, the backend creates the configured database and `site_content` table automatically, then seeds default content if the table is empty.

## Docker deployment

Docker Compose runs the following services:

- `frontend`: Nginx serving the Vite production build on host port `8082`.
- `api`: private Node.js content API.
- `db`: private PostgreSQL 16 database with a persistent volume.

Create a production `.env` file that is never committed:

```dotenv
DOCKERHUB_USERNAME=your-dockerhub-user
API_ORIGIN=https://www.reddot.com.bd
AUTH_SECRET=generate-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-unique-strong-password
DB_PASSWORD=use-a-unique-strong-password
```

Build and run the stack locally:

```bash
docker compose up --build -d
docker compose ps
curl http://127.0.0.1:8082/api/health
```

Uploaded media is stored in the named `uploads` volume and survives container recreation. PostgreSQL data is stored in the named `postgres-data` volume.

## EC2 deployment

1. Install Docker Engine, Docker Compose plugin, Git, Nginx, and Certbot on the EC2 host.
2. Create the application directory and clone the repository:

```bash
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps
git clone git@github.com:rehmanshawon/reddot.git reddot
cd reddot
```

3. Create `/home/ubuntu/apps/reddot/.env` with the production values shown above.
4. Install [deploy/nginx.reddot.com.bd.conf](deploy/nginx.reddot.com.bd.conf) as `/etc/nginx/sites-available/reddot.com.bd`, enable it, and validate Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/reddot.com.bd /etc/nginx/sites-enabled/reddot.com.bd
sudo nginx -t
sudo systemctl reload nginx
```

5. After `reddot.com.bd` and `www.reddot.com.bd` resolve to this EC2 instance, obtain the TLS certificate:

```bash
sudo certbot --nginx -d reddot.com.bd -d www.reddot.com.bd
```

6. Add these GitHub repository secrets before pushing to `main`:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`

The deployment workflow builds and publishes the frontend/API images, then pulls and recreates the EC2 stack at `/home/ubuntu/apps/reddot`.

Verify the deployed site:

```bash
curl -I https://www.reddot.com.bd
curl https://www.reddot.com.bd/api/health
```
