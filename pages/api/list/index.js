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

  const rawLists = await T.get("lists/list");

  const lists = rawLists.data
    .map(({ id_str, name, uri, mode, member_count, created_at }) => ({
      id: id_str, // Use id_str instead of id, which is returning wrong number
      name,
      uri,
      mode,
      member_count,
      created_at,
    }))
    // Sort by member count DESC
    .sort((listA, listB) => listB.member_count - listA.member_count);

  res.json(lists);
}
