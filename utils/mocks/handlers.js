import { rest } from "msw";

import userMock from "./user.json";
import friendsMock from "./friends.json";
import listsMock from "./lists.json";
import listMembersMock from "./list-members.json";

export const handlers = [
  rest.get("*/api/user", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userMock));
  }),
  rest.get("*/api/friends", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(friendsMock));
  }),
  rest.get("*/api/list", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(listsMock));
  }),
  rest.get("*/api/lists/:listId/get-members", (req, res, ctx) => {
    // const { listId } = req.params;
    return res(ctx.status(200), ctx.json(listMembersMock));
  }),
  rest.post("*/api/lists/create", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(listsMock[0]));
  }),
  rest.post("*/api/lists/:listId/remove-member", (req, res, ctx) => {
    return res(ctx.status(200), ctx.text("OK"));
  }),
];
