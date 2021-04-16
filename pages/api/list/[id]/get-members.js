const Twit = require("twit");
const Cookies = require("cookies");

export default async function handler(req, res) {
  console.log("LIST MEMBERS ENDPOINT");

  const cookies = new Cookies(req, res);

  const twitterAccessToken = cookies.get("twitterAccessToken");
  const twitterAccessTokenSecret = cookies.get("twitterAccessTokenSecret");

  // @TODO: Check how to redirect from endpoint if user is not logged in to twitter
  // @TODO: DRY code - Twit configuration and auth checks

  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: twitterAccessToken,
    access_token_secret: twitterAccessTokenSecret,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });

  const { id: listId } = req.query;

  const rawMembers = await T.get("lists/members", {
    list_id: listId,
    count: 5000,
  });

  res.json(rawMembers.data.users);
}
