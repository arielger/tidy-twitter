import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../utils/apiSetup";
import { Friend } from "../../types";

type Response = Friend[] | "ERROR";

type TwitterListResponse = {
  data: { users: Friend[] };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res);

  try {
    // @TODO: Check how import all followers instead of the first 200
    const rawFriends = (await T.get("friends/list", {
      count: 200, // max count
    })) as TwitterListResponse;

    const friends = rawFriends.data.users.map(
      ({
        id,
        name,
        screen_name,
        description,
        url,
        followers_count,
        friends_count,
        statuses_count,
        profile_image_url,
      }) => ({
        id,
        name,
        screen_name,
        description,
        url,
        followers_count,
        friends_count,
        statuses_count,
        profile_image_url,
      })
    );

    res.json(friends);
  } catch (err) {
    res.status(400).send("ERROR");
  }
}