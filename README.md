# Red Dot

React frontend plus a lightweight Node.js backend for Red Dot, a Bangladesh advertising film agency.

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

## Tech

- React
- Vite
- React Router
- Node.js
- MySQL

## Run

```bash
npm install
npm run server
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Demo Admin Credentials

- Email: `admin@reddot.local`
- Password: `reddot-admin`

## Notes

- Content is stored in MySQL by the Node.js backend.
- Admin authentication is handled by backend-issued bearer tokens.
- Production secrets should be set from environment variables instead of defaults.
- On EC2, run the Node API on an internal port such as `3001` and proxy `/api` through Nginx.
- On first boot, the backend creates the configured database and `site_content` table automatically, then seeds default content if the table is empty.

## EC2 Deploy

1. Pull the latest code onto the server:

```bash
cd /var/www/reddot-app
git pull
npm install
npm run build
```

Make sure your PM2 env includes the MySQL connection settings:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=reddot
```

2. Start the Node API with PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

3. Copy the Nginx example config from `deploy/nginx.reddot.ilogicmagic.com.conf` into your active site config, then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

4. Verify:

```bash
curl -I https://reddot.ilogicmagic.com
curl https://reddot.ilogicmagic.com/api/health
```
