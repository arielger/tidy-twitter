import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { Flex, useDisclosure, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Sidebar from "../../components/Sidebar";
import ListsList from "../../components/ListsList/ListsList";
import FollowingList from "../../components/FollowingList";
import AddMembersDrawer from "../../components/AddMembersDrawer";
import NewListModal from "../../components/NewListModal";
import { useAuth } from "../../modules/auth";

import {
  fetchUser,
  fetchFriends,
  fetchLists,
  fetchListMembers,
} from "../../utils/api";

export default function Home() {
  const router = useRouter();
  const {
    value: { isAuthenticated },
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const {
    isOpen: isAddMembersOpen,
    onOpen: onAddMembersOpen,
    onClose: onAddMembersClose,
  } = useDisclosure();
  const {
    isOpen: isCreateListOpen,
    onOpen: onCreateListOpen,
    onClose: onCreateListClose,
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
  } = useQuery("friends", () => fetchFriends(user.id), {
    // @TODO: Check if we can get the user.id from auth token to improve load times
    enabled: !!user?.id,
  });

  const {
    isLoading: isLoadingLists,
    isError: errorFetchingLists,
    data: lists,
  } = useQuery("lists", fetchLists);
  const [selectedListId, setSelectedListId] = useState<string>();
  const selectedList =
    lists && lists.find((list) => list.id === selectedListId);

  // @TODO: Review if repeating the query is the best solution here
  // Best way to approach tests for react-query
  const { data: listMembers } = useQuery(
    ["list", "members", selectedListId],
    () => fetchListMembers(selectedListId!),
    {
      enabled: false,
    }
  );

  const membersToAdd = useMemo(() => {
    const listMembersIds = (listMembers || []).map((user) => user.id);
    return friends?.filter(
      (friend) =>
        !listMembersIds?.find((listMemberId) => listMemberId === friend.id)
    );
  }, [listMembers, friends]);

  // Show spinner if user is not authenticated until the redirection to the landing page is completed
  const isLoadingPage = isLoadingUser || !isAuthenticated;

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
        handleCreateList={onCreateListOpen}
      />
      <FollowingList
        selectedList={selectedList}
        handleAddMembers={onAddMembersOpen}
      />
      {selectedList && (
        <AddMembersDrawer
          friends={friends}
          isLoadingFriends={isLoadingFriends}
          membersToAdd={membersToAdd}
          isVisible={isAddMembersOpen}
          onClose={onAddMembersClose}
          selectedList={selectedList}
        />
      )}
      <NewListModal isOpen={isCreateListOpen} onClose={onCreateListClose} />
    </Flex>
  );
}
