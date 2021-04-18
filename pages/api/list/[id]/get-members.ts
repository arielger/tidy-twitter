import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../../../utils/apiSetup";
import { Friend } from "../../../../types";

type Response = Friend[] | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res);

  const { id: listId } = req.query;

  try {
    const rawMembers: any = await T.get("lists/members", {
      list_id: listId as string,
      count: 5000,
    });

    res.json(rawMembers?.data?.users);
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
