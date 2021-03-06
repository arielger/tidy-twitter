import type { NextApiRequest, NextApiResponse } from "next";

import createList from "../../../api/lists/create";
import getLists from "../../../api/lists/getAll";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return createList(req, res);
  } else if (req.method === "GET") {
    return getLists(req, res);
  } else {
    return res.status(400).send("ERROR");
  }
}
