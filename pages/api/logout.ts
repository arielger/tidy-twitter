import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

type Response = "OK" | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  var cookies = new Cookies(req, res);

  // @TODO: Review how to log out properly
  // Should invalidate token
  // How to invalidate httpOnly cookies?
  // https://security.stackexchange.com/questions/140326/delete-cookie-or-set-httponly-and-secure
  // https://developer.twitter.com/en/docs/authentication/api-reference/invalidate_bearer_token

  cookies.set("twitterAccessToken");
  cookies.set("twitterAccessTokenSecret");
  cookies.set("twitterRequestTokenSecret");

  try {
    res.status(200).send("OK");
  } catch (err) {
    console.log("err", err);
    res.status(400).send("ERROR");
  }
}
