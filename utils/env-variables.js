const config = {
  production: {
    protocol: "https",
    siteUrl: "tidy-twitter.vercel.app",
  },
  preview: {
    protocol: "https",
    siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  },
  development: {
    protocol: "http",
    siteUrl: "localhost:3000",
  },
}[process.env.NEXT_PUBLIC_VERCEL_ENV || "development"];

const SITE_URL = `${config.protocol}://${config.siteUrl}`;
const API_URL = `${config.protocol}://${config.siteUrl}/api`;

module.exports = {
  SITE_URL,
  API_URL,
};
