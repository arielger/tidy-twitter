import type { NextApiRequest, NextApiResponse } from "next";
import { twitSetup } from "../../../utils/apiSetup";
import { List } from "../../../types";

export const config = {
  api: {
    bodyParser: true,
  },
};

type TwitterApiList = List & {
  id_str: string;
};

const transformFromApi = ({
  id_str,
  name,
  uri,
  mode,
  member_count,
  created_at,
}: TwitterApiList) => ({
  id: id_str,
  name,
  uri,
  mode,
  member_count,
  created_at,
});

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

    res.json(transformFromApi(response.data as TwitterApiList));
  } catch (err) {
    res.status(400).send("ERROR");
  }
}
