import type { NextApiRequest, NextApiResponse } from "next";
import { twitSetup } from "../../utils/apiSetup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const T = twitSetup(req, res);

    const { id: listId } = req.query;

    await T.post("lists/destroy", {
      list_id: listId as string,
    });

    res.status(200).send("OK");
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
