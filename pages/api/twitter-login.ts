import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import ms from "ms";

type Response = { requestToken: string } | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const cookies = new Cookies(req, res);

  const twitterSignIn = require("twittersignin")({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  try {
    const { site_url } = req.query;

    const response = await twitterSignIn.getRequestToken({
      oauth_callback: `${site_url}/api/twitter-callback`,
    });

    const requestToken = response.oauth_token;
    const requestTokenSecret = response.oauth_token_secret;

    // Need to save the request token secret to get accessToken in the callback
    cookies.set("twitterRequestTokenSecret", requestTokenSecret, {
      maxAge: ms("30s"),
    });

    // @TODO: CHECK IF CALLBACK IS CONFIRMED
    // const callbackConfirmed = response.oauth_callback_confirmed;

    res.json({ requestToken });
  } catch (e) {
    res.status(400).send("ERROR");
  }
}
