import Twit from "twit";
import Cookies from "cookies";
import type { NextApiRequest, NextApiResponse } from "next";

export function twitSetup(req: NextApiRequest, res: NextApiResponse): Twit {
  const cookies = new Cookies(req, res);

  const twitterAccessToken = cookies.get("twitterAccessToken");
  const twitterAccessTokenSecret = cookies.get("twitterAccessTokenSecret");

  if (!twitterAccessToken || !twitterAccessTokenSecret) {
    res.status(401).send("Missing Twitter credentials");
  }

  return new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token: twitterAccessToken,
    access_token_secret: twitterAccessTokenSecret,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });
}
