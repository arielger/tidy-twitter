const Cookies = require("cookies");

export default async function handler(req, res) {
  console.log("TWITTER LOGIN API");

  const cookies = new Cookies(req, res);

  const twitterSignIn = require("twittersignin")({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const response = await twitterSignIn.getRequestToken({
    oauth_callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitter-callback`,
  });

  const requestToken = response.oauth_token;
  const requestTokenSecret = response.oauth_token_secret;

  // Need to save the request token secret to get accessToken in the callback
  cookies.set("twitterRequestTokenSecret", requestTokenSecret);

  // @TODO: CHECK IF CALLBACK IS CONFIRMED
  // const callbackConfirmed = response.oauth_callback_confirmed;

  // @TODO: Should this be done with a redirect from the server?
  // https://cors-anywhere.herokuapp.com/
  // res.redirect(
  //   302,
  //   `https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken}`
  // );

  res.end(JSON.stringify({ requestToken }));
}
