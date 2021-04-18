import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../../utils/apiSetup";
import { List } from "../../../types";

type Response = List[] | "ERROR";

type TwitterApiList = List & {
  id_str: string;
};
type TwitterListResponse = {
  data: TwitterApiList[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res);

  try {
    const rawLists = (await T.get("lists/list")) as TwitterListResponse; // Not sure if casting is the best solution here

    const lists = rawLists.data
      .map(({ id_str, name, uri, mode, member_count, created_at }) => ({
        id: id_str, // Use id_str instead of id, which is returning wrong number
        name,
        uri,
        mode,
        member_count,
        created_at,
      }))
      // Sort by member count DESC
      .sort((listA, listB) => listB.member_count - listA.member_count);

    res.json(lists);
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
