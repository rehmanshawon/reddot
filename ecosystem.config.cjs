module.exports = {
  apps: [
    {
      name: "reddot-api",
      script: "npm",
      args: "run start",
      cwd: "/var/www/reddot-app",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        API_ORIGIN: "https://reddot.ilogicmagic.com",
        AUTH_SECRET: "change-this-secret-before-production",
        ADMIN_EMAIL: "admin@reddot.local",
        ADMIN_PASSWORD: "reddot-admin",
      },
    },
  ],
};
