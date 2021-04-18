import { useState } from "react";
import { useQuery } from "react-query";
import { Flex, useDisclosure, Spinner } from "@chakra-ui/react";

import Sidebar from "../../components/Sidebar";
import ListsList from "../../components/ListsList";
import FollowingList from "../../components/FollowingList";
import AddMembersDrawer from "../../components/AddMembersDrawer";

import {
  fetchUser,
  fetchFriends,
  fetchLists,
  fetchListMembers,
} from "../../utils/api";

// @TODO: Prevent showing dashboard if user is not logged in

export default function Home() {
  const {
    isOpen: isAddMembersOpen,
    onOpen: onAddMembersOpen,
    onClose: onAddMembersClose,
  } = useDisclosure();

  const {
    isLoading: isLoadingUser,
    isError: errorFetchingUser,
    data: user,
  } = useQuery("user", fetchUser);
  const {
    isLoading: isLoadingFriends,
    isError: errorLoadingFriends,
    data: friends,
  } = useQuery("friends", fetchFriends);

  const {
    isLoading: isLoadingLists,
    isError: errorFetchingLists,
    data: lists,
  } = useQuery("lists", fetchLists);
  const [selectedListId, setSelectedListId] = useState();
  const selectedList =
    lists && lists.find((list) => list.id === selectedListId);

  const {
    isLoading: isLoadingListMembers,
    isError: errorFetchingListMembers,
    data: listMembers,
  } = useQuery(
    `list.members.${selectedListId}`,
    () => fetchListMembers(selectedListId),
    {
      enabled: !!selectedListId,
      staleTime: Infinity, // Data will not be considered stale
    }
  );

  const isLoadingPage = isLoadingUser;

  if (isLoadingPage) {
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex height="100vh" flexDir="row" overflow="hidden">
      <Sidebar user={user} />
      <ListsList
        loading={isLoadingLists}
        error={errorFetchingLists}
        lists={lists}
        selectedListId={selectedListId}
        setSelectedListId={setSelectedListId}
      />
      <FollowingList
        loading={isLoadingListMembers}
        error={errorFetchingListMembers}
        users={listMembers}
        selectedList={selectedList}
        handleAddMembers={onAddMembersOpen}
      />
      <AddMembersDrawer
        friends={friends}
        isVisible={isAddMembersOpen}
        onClose={onAddMembersClose}
        selectedList={selectedList}
      />
    </Flex>
  );
}
