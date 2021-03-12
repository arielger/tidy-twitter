const Cookies = require("cookies");

const { SITE_URL } = require("../../utils/env-variables");

export default async function handler(req, res) {
  console.log("TWITTER CALLBACK API");
  const twitterSignIn = require("twittersignin")({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const cookies = new Cookies(req, res);

  const oauthVerifier = req.query.oauth_verifier;
  const requestToken = req.query.oauth_token;
  // Get the request token secret from where we stored it (Step 1)
  const requestTokenSecret = cookies.get("twitterRequestTokenSecret");

  const response = await twitterSignIn.getAccessToken(
    requestToken,
    requestTokenSecret,
    oauthVerifier
  );

  cookies.set("twitterAccessToken", response.oauth_token);
  cookies.set("twitterAccessTokenSecret", response.oauth_token_secret);

  res.redirect(302, `${SITE_URL}/dashboard/lists`);
}
