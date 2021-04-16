const Twit = require("twit");
const Cookies = require("cookies");

export default async function handler(req, res) {
  const cookies = new Cookies(req, res);

  const twitterAccessToken = cookies.get("twitterAccessToken");
  const twitterAccessTokenSecret = cookies.get("twitterAccessTokenSecret");

  // @TODO: Check how to redirect from endpoint if user is not logged in to twitter

  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: twitterAccessToken,
    access_token_secret: twitterAccessTokenSecret,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });

  // @TODO: Check how import all followers instead of the first 200

  const rawUser = await T.get("account/verify_credentials", {
    skip_status: true,
  });

  const user = (({
    id,
    name,
    screen_name,
    description,
    profile_image_url,
  }) => ({
    id,
    name,
    screen_name,
    description,
    profile_image_url,
  }))(rawUser.data);

  res.json(user);
}
