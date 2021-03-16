const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? "tidy-twitter.vercel.app"
    : process.env.NEXT_PUBLIC_SITE_URL;

const SITE_URL = `${protocol}:/${siteUrl}`;
const API_URL = `${protocol}:/${siteUrl}/api`;

module.exports = {
  SITE_URL,
  API_URL,
};
