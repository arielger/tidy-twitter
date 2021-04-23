import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../utils/apiSetup";
import { Friend } from "../../types";

type Response = Friend[] | "ERROR";

type TwitterApiFriend = Friend & {
  id_str: string;
};

type TwitterFriendsResponse = {
  data: { users: TwitterApiFriend[] };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res);

  try {
    const rawFriends = (await T.get("friends/list", {
      count: 200, // max count
    })) as TwitterFriendsResponse;

    const friends = rawFriends.data.users.map(
      ({
        id_str,
        name,
        screen_name,
        description,
        url,
        followers_count,
        friends_count,
        statuses_count,
        profile_image_url,
      }) => ({
        id: id_str,
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
