const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

const SITE_URL = `${protocol}://${process.env.NEXT_PUBLIC_SITE_URL}`;
const API_URL = `${protocol}://${process.env.NEXT_PUBLIC_SITE_URL}/api`;

module.exports = {
  SITE_URL,
  API_URL,
};
