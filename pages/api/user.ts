import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../utils/apiSetup";
import { User } from "../../types";

type TwitterListResponse = {
  data: User;
};

type Response = User | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res);

  try {
    const rawUser = (await T.get("account/verify_credentials", {
      skip_status: true,
    })) as TwitterListResponse;

    // @TODO: Review if we should we use id_str here?

    const user = (({
      id,
      name,
      screen_name,
      description,
      profile_image_url,
    }) => ({
      id,
      name,
      screen_name,
      description,
      profile_image_url,
    }))(rawUser.data);

    res.json(user);
  } catch (error) {
    res.status(400).send("ERROR");
  }
}
