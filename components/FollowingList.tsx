import React from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Text,
  Icon,
  Button,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { BiGroup, BiUserPlus, BiUserMinus } from "react-icons/bi";

import { fetchListMembers, removeListMember } from "../utils/api";
import { Friend, List } from "../types";

function FollowingMember({
  user,
  selectedList,
}: {
  user: Friend;
  selectedList: List;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const removeFromList = useMutation(removeListMember, {
    onSuccess: (_, { userId: removedUserId }) => {
      queryClient.setQueryData<Friend[]>(
        ["list", "members", selectedList.id],
        (listMembers) =>
          (listMembers || []).filter((member) => member.id !== removedUserId)
      );
      queryClient.setQueryData<List[]>("lists", (lists) =>
        (lists || []).map((list) =>
          list.id === selectedList.id
            ? {
                ...list,
                member_count: list.member_count - 1,
              }
            : list
        )
      );

      toast({
        title: "Member removed",
        description: `The user ${user.name} was removed from ${selectedList.name}`,
        status: "success",
        isClosable: true,
      });
    },
  });

  return (
    <Flex
      key={user.id}
      borderBottom="1px"
      borderColor="gray.200"
      p="3"
      data-testid={`following-list-member-${user.id}`}
      height="72px"
    >
      <Avatar
        mr="3"
        name={user.name}
        src={user.profile_image_url.replace("normal", "bigger")}
      ></Avatar>
      <Flex direction="column">
        <Text>{user.name}</Text>
        <Text color="gray.400">@{user.screen_name}</Text>
      </Flex>
      <IconButton
        isLoading={removeFromList.isLoading}
        onClick={() =>
          removeFromList.mutate({
            listId: selectedList.id,
            userId: user.id,
          })
        }
        ml="auto"
        title="Remove from list"
        aria-label="Remove from list"
        icon={<BiUserMinus />}
        colorScheme="red"
        variant="outline"
      />
    </Flex>
  );
}

type props = {
  selectedList?: List;
  handleAddMembers: () => void;
};

export default function FollowingList({
  selectedList,
  handleAddMembers,
}: props) {
  const {
    isLoading,
    isError,
    data: users,
  } = useQuery(
    ["list", "members", selectedList?.id],
    () => fetchListMembers(selectedList?.id!),
    {
      enabled: !!selectedList?.id,
      staleTime: Infinity, // Data will not be considered stale
    }
  );

  return (
    <Flex as="main" flexGrow={1} flexDirection="column">
      <Flex
        h="24"
        px="4"
        alignItems="center"
        borderBottom="1px"
        borderColor="gray.200"
        flexShrink={0}
      >
        <Heading size="md" mr="8">
          {selectedList?.name}
        </Heading>
        {Boolean(selectedList) && (
          <Box>
            <Icon as={BiGroup} mr="2"></Icon>
            {selectedList?.member_count}{" "}
            {selectedList?.member_count === 1 ? "member" : "members"}
          </Box>
        )}
        {!!selectedList && (
          <Button
            onClick={handleAddMembers}
            marginLeft="auto"
            rightIcon={<BiUserPlus />}
          >
            Add members
          </Button>
        )}
      </Flex>
      <Flex as="ul" overflow="auto" flexDirection="column" flexGrow={1}>
        {!selectedList ? (
          <Flex
            flexDirection="column"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={BiGroup} w={8} h={8} mb={1} color="gray.500" />
            <Text color="gray.500">Select a list to see the members</Text>
          </Flex>
        ) : isLoading ? (
          <Flex height="100%" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : (
          users &&
          users.map((user) => (
            <FollowingMember
              key={user.id}
              user={user}
              selectedList={selectedList}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
}
