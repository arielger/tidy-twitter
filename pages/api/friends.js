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

  const rawFriends = await T.get("friends/list", {
    count: 200, // max count
  });

  const friends = rawFriends.data.users.map(
    ({
      id,
      name,
      screen_name,
      description,
      url,
      followers_count,
      friends_count,
      statuses_count,
      profile_image_url,
    }) => ({
      id,
      name,
      screen_name,
      description,
      url,
      followers_count,
      friends_count,
      statuses_count,
      profile_image_url,
    })
  );

  res.json(friends);
}
