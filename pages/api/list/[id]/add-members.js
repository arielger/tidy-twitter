const Twit = require("twit");
const Cookies = require("cookies");

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  console.log("LIST ADD MEMBERS ENDPOINT");

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

  const { id: listId } = req.query;
  const { user_id, screen_name } = JSON.parse(req.body);

  const rawMembers = await T.post("lists/members/create_all", {
    list_id: listId,
    user_id: user_id,
    screen_name: screen_name,
  });

  res.json(rawMembers);
}
