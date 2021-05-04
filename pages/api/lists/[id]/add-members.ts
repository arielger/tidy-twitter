import type { NextApiRequest, NextApiResponse } from "next";
import { twitSetup } from "../../../../utils/apiSetup";

export const config = {
  api: {
    bodyParser: true,
  },
};

type Response = "OK" | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const T = twitSetup(req, res);

    const { id: listId } = req.query;
    const { user_id } = JSON.parse(req.body);

    const result = await T.post("lists/members/create_all", {
      list_id: listId as string,
      user_id: user_id,
    });

    res.status(200).send("OK");
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
