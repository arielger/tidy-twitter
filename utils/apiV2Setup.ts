import Twitter, { TwitterOptions } from "twitter-lite";
import Cookies from "cookies";
import type { NextApiRequest, NextApiResponse } from "next";

export function twitSetup(
  req: NextApiRequest,
  res: NextApiResponse,
  twitterOptions: Partial<TwitterOptions> = {}
): Twitter {
  const cookies = new Cookies(req, res);

  const twitterAccessToken = cookies.get("twitterAccessToken");
  const twitterAccessTokenSecret = cookies.get("twitterAccessTokenSecret");

  if (!twitterAccessToken || !twitterAccessTokenSecret) {
    res.status(401).send("Missing Twitter credentials");
  }

  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: twitterAccessToken,
    access_token_secret: twitterAccessTokenSecret,
    ...twitterOptions,
  });
}
