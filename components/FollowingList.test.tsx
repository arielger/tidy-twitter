import userEvent from "@testing-library/user-event";

import FollowingList from "./FollowingList";
import { List } from "../types";
import {
  queryClient,
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from "../utils/test-utils";
import { server } from "../utils/mocks/server";
import friendsMock from "../utils/mocks/friends.json";
import listsMock from "../utils/mocks/lists.json";

const getMembers = () =>
  screen.getAllByTestId(`following-list-member`, { exact: false });
const getMember = (id: string) =>
  screen.getByTestId(`following-list-member-${id}`);
const queryMember = (id: string) =>
  screen.queryByTestId(`following-list-member-${id}`);

describe("FollowingList", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should remove user from list when deleting", async () => {
    const listQueryKey = ["list", "members", listsMock[0].id];
    const firstMemberId = friendsMock[0].id;

    // Set-up react-query data
    queryClient.setQueryData(listQueryKey, friendsMock);

    render(
      <FollowingList
        selectedList={listsMock[0] as List}
        handleAddMembers={() => {}}
      />
    );
    expect(getMembers()).toHaveLength(friendsMock.length);

    const firstDeleteBtn = within(getMember(firstMemberId)).getByRole(
      "button",
      {
        name: /remove/i,
      }
    );
    userEvent.click(firstDeleteBtn);
    await waitForElementToBeRemoved(() => queryMember(firstMemberId));
    expect(getMembers()).toHaveLength(friendsMock.length - 1);
  });
});
