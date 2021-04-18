import type { NextApiRequest, NextApiResponse } from "next";
import _twitterSignIn from "twittersignin";
import Cookies from "cookies";

import { SITE_URL } from "../../utils/env-variables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const twitterSignIn = _twitterSignIn({
    consumerKey: process.env.TWITTER_CONSUMER_KEY!,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });

  const cookies = new Cookies(req, res);

  const oauthVerifier = req.query.oauth_verifier as string;
  const requestToken = req.query.oauth_token as string;

  // Get the request token secret from where we stored it (Step 1)
  const requestTokenSecret = cookies.get("twitterRequestTokenSecret");

  if (!requestTokenSecret) {
    res.status(400).send("No token secret provided");
  }

  try {
    const response = await twitterSignIn.getAccessToken(
      requestToken,
      requestTokenSecret!,
      oauthVerifier
    );

    cookies.set("twitterAccessToken", response.oauth_token);
    cookies.set("twitterAccessTokenSecret", response.oauth_token_secret);

    res.redirect(302, `${SITE_URL}/dashboard/lists`);
  } catch (e) {
    res.status(400).send("ERROR");
  }
}
