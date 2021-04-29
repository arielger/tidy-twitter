import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../../utils/apiSetup";
import { List } from "../../../types";

type Response = List[] | "ERROR";

type TwitterApiList = List & {
  id_str: string;
};
type TwitterListResponse = {
  data: { lists: TwitterApiList[] };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res);

  try {
    const rawLists = (await T.get("lists/ownerships", {
      count: 1000,
    })) as TwitterListResponse;

    const lists = rawLists.data.lists
      .map(
        ({
          id_str,
          name,
          description,
          uri,
          mode,
          member_count,
          created_at,
        }) => ({
          id: id_str, // Use id_str instead of id, which is returning wrong number
          name,
          description,
          uri,
          mode,
          member_count,
          created_at,
        })
      )
      // Sort by member count DESC
      .sort((listA, listB) => listB.member_count - listA.member_count);

    res.json(lists);
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
