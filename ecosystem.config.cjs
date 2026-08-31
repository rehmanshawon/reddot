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
        AUTH_SECRET: process.env.AUTH_SECRET,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        DB_HOST: "127.0.0.1",
        DB_PORT: 3306,
        DB_USER: "root",
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: "reddot",
      },
    },
  ],
};
