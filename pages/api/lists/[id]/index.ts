import type { NextApiRequest, NextApiResponse } from "next";

import updateList from "../../../../api/lists/update";
import deleteList from "../../../../api/lists/delete";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    return updateList(req, res);
  } else if (req.method === "DELETE") {
    return deleteList(req, res);
  } else {
    res.status(400).send("ERROR");
  }
}
