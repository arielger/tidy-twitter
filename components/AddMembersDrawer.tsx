import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Avatar,
  Text,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";

import { Friend, List } from "../types";
import { addListMembers } from "../utils/api";
import useFuse from "../hooks/useFuse";

type props = {
  isLoadingFriends: boolean;
  friends?: Friend[];
  membersToAdd?: Friend[];
  isVisible: boolean;
  onClose: () => void;
  selectedList: List;
};

export default function AddMembersDrawer({
  isLoadingFriends,
  friends,
  membersToAdd,
  isVisible,
  onClose,
  selectedList,
}: props) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [selectedFriendsIds, setSelectedFriendsIds] = useState<string[]>([]);

  const {
    isLoading: isLoadingAddingMembers,
    isError: errorAddingMembers,
    mutate: addMembers,
  } = useMutation(addListMembers, {
    // Update selected list with newly added members
    onSuccess: (_, { listId, usersIds }) => {
      setSelectedFriendsIds([]);

      toast({
        title: "Members added",
        description: `${usersIds.length} user${
          usersIds.length > 1 ? "s were" : " was"
        } added to the ${selectedList.name} list.`,
        status: "success",
        isClosable: true,
      });

      queryClient.setQueryData<Friend[]>(
        ["list", "members", listId],
        (oldListMembers) => {
          // Not sure if type casting is the best solution here
          const newMembers = usersIds.map((userId) =>
            (friends as Friend[]).find((friend) => friend.id === userId)
          );

          return [
            ...(oldListMembers ? oldListMembers : []),
            ...newMembers,
          ] as Friend[];
        }
      );

      queryClient.setQueryData<List[]>("lists", (lists) =>
        (lists || []).map((list) =>
          list.id === selectedList.id
            ? {
                ...list,
                member_count: list.member_count + usersIds.length,
              }
            : list
        )
      );

      onClose();
    },
  });

  const {
    query,
    onSearch,
    results,
  }: { query: string; onSearch: () => void; results: Friend[] } = useFuse(
    membersToAdd,
    {
      threshold: 0.4,
      keys: ["name", "screen_name", "description"],
      minMatchCharLength: 2,
      ignoreLocation: true,
    }
  );

  const handleToggleFriend = useCallback(
    (id: string, isChecked: boolean) => {
      setSelectedFriendsIds(
        isChecked
          ? [...selectedFriendsIds, id]
          : selectedFriendsIds.filter((friendId) => friendId !== id)
      );
    },
    [selectedFriendsIds]
  );

  return (
    <Drawer isOpen={isVisible} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Add members
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <BiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                value={query}
                onChange={onSearch}
                placeholder="Search followers by username or description"
              />
            </InputGroup>
          </DrawerHeader>

          <DrawerBody>
            {isLoadingFriends ? (
              <Text>Loading users...</Text>
            ) : (
              results &&
              results.map(({ id, profile_image_url, name, screen_name }) => (
                <Flex key={id} borderBottom="1px" borderColor="gray.200" py="3">
                  <Checkbox
                    isChecked={selectedFriendsIds.includes(id)}
                    onChange={(e) => handleToggleFriend(id, e.target.checked)}
                    spacing="1rem"
                  >
                    <Flex>
                      <Avatar
                        mr="3"
                        name={name}
                        src={profile_image_url.replace("normal", "bigger")}
                      ></Avatar>
                      <Flex direction="column">
                        <Text>{name}</Text>
                        <Text color="gray.400">@{screen_name}</Text>
                      </Flex>
                    </Flex>
                  </Checkbox>
                </Flex>
              ))
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button
              disabled={selectedFriendsIds.length === 0}
              isLoading={isLoadingAddingMembers}
              colorScheme="blue"
              onClick={() =>
                addMembers({
                  listId: selectedList.id,
                  usersIds: selectedFriendsIds,
                })
              }
            >
              Add to list
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
