import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../utils/apiSetup";
import { List } from "../../types";

import { TwitterApiList, transformListFromApi } from "./utils";

type Response = List[] | "ERROR";

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
      .map(transformListFromApi)
      // Sort by member count DESC
      .sort((listA, listB) => listB.member_count - listA.member_count);

    res.json(lists);
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
