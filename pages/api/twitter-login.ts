import type { NextApiRequest, NextApiResponse } from "next";
import _twitterSignIn from "twittersignin";
import Cookies from "cookies";

import { API_URL } from "../../utils/env-variables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res);

  const twitterSignIn = require("twittersignin")({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  try {
    const response = await twitterSignIn.getRequestToken({
      oauth_callback: `${API_URL}/twitter-callback`,
    });

    const requestToken = response.oauth_token;
    const requestTokenSecret = response.oauth_token_secret;

    // Need to save the request token secret to get accessToken in the callback
    cookies.set("twitterRequestTokenSecret", requestTokenSecret);

    // @TODO: CHECK IF CALLBACK IS CONFIRMED
    // const callbackConfirmed = response.oauth_callback_confirmed;

    res.end(JSON.stringify({ requestToken }));
  } catch (e) {
    res.status(400).send("ERROR");
  }
}