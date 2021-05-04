import type { NextApiRequest, NextApiResponse } from "next";
import { twitSetup } from "../../../../utils/apiSetup";

type Response = "OK" | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "DELETE") {
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
  } else {
    res.status(400).send("ERROR");
  }
}
