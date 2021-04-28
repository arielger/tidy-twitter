import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

type Response = "OK" | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  var cookies = new Cookies(req, res);

  cookies.set("twitterAccessToken");
  cookies.set("twitterAccessTokenSecret");
  cookies.set("twitterRequestTokenSecret");
  cookies.set("isLoggedIn");

  try {
    res.status(200).send("OK");
  } catch (err) {
    console.log("err", err);
    res.status(400).send("ERROR");
  }
}
