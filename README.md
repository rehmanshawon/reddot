# Red Dot Frontend

React frontend for Red Dot, a Bangladesh advertising film agency.

## Included

- Agency-style landing page
- Recent works gallery with reel modal
- Full works archive grid
- BTS gallery with linked reel modal
- About page
- Leadership message page
- Creative team page
- Admin login/logout placeholder
- Admin dashboard with editable local content

## Tech

- React
- Vite
- React Router

## Run

```bash
npm install
npm run dev
```

## Demo Admin Credentials

- Email: `admin@reddot.local`
- Password: `reddot-admin`

## Notes

- Current content is sample data stored in browser local storage.
- Admin authentication is frontend-only for now.
- Next phase can replace the local content store with NestJS APIs and database-backed content.
- The frontend can be deployed to AWS S3 + CloudFront or paired with a NestJS backend on ECS, Elastic Beanstalk, or EC2.
