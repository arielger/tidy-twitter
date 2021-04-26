import type { NextApiRequest, NextApiResponse } from "next";

import { twitSetup } from "../../utils/apiV2Setup";
import { getAllResultsFromPagination } from "../../utils/api-utils";
import { Friend } from "../../types";

type TwitterV2Friend = Friend & {
  username: string;
};

type Response = Friend[] | "ERROR";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const T = twitSetup(req, res, {
    version: "2",
    extension: false,
  });

  const { user_id } = req.query;

  try {
    const allFollowing = await getAllResultsFromPagination<TwitterV2Friend>(
      T,
      (paginationProps) =>
        T.get(`users/${user_id}/following`, {
          max_results: 1000,
          ["user.fields"]: "id,description,name,profile_image_url,username,url",
          ...paginationProps,
        })
    );

    // Map data to follow v1 api format
    const friends = allFollowing.map(({ username, ...friend }) => ({
      ...friend,
      screen_name: username,
    }));

    res.json(friends);
  } catch (err) {
    console.log("err", err);
    res.status(400).send("ERROR");
  }
}
