import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../../../utils/apiSetup";
import { Friend } from "../../../../types";

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

  const { id: listId } = req.query;

  try {
    const rawMembers = (await T.get("lists/members", {
      list_id: listId as string,
      count: 5000,
    })) as TwitterFriendsResponse;

    const members = rawMembers.data.users.map(
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

    res.json(members);
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
