import type { NextApiRequest, NextApiResponse } from "next";
import { twitSetup } from "../../utils/apiSetup";
import { List } from "../../types";

import { TwitterApiList, transformListFromApi } from "./utils";

export const config = {
  api: {
    bodyParser: true,
  },
};

type Response = List | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const T = twitSetup(req, res);

    const { name, description, mode } = JSON.parse(req.body);

    const response = await T.post("lists/create", {
      name,
      description,
      mode,
    });

    res.json(transformListFromApi(response.data as TwitterApiList));
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
