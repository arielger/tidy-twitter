import React, { useState } from "react";
import {
  Heading,
  Text,
  Button,
  Flex,
  Icon,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { BiListUl } from "react-icons/bi";

import ListModal from "../ListModal";
import ListItem from "./ListItem";

function EmptyState() {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Icon as={BiListUl} w={8} h={8} mb={1} color="gray.500" />
      <Text color="gray.500">You don't have any list</Text>
    </Flex>
  );
}

import { List } from "../../types";

type props = {
  loading: boolean;
  error: boolean;
  lists?: List[];
  selectedListId?: string;
  setSelectedListId: (id: string) => void;
  handleCreateList: () => void;
};

export default function ListsList({
  loading,
  error,
  lists,
  selectedListId,
  setSelectedListId,
  handleCreateList,
}: props) {
  const [editedListId, setEditedListId] = useState("");
  const {
    isOpen: isEditListOpen,
    onOpen: onEditListOpen,
    onClose: onEditListClose,
  } = useDisclosure();

  const onEditList = (listId: string) => {
    setEditedListId(listId);
    onEditListOpen();
  };
  const listToEdit = lists?.find((list) => list.id === editedListId);

  return (
    <Flex
      width="xs"
      maxWidth="xs"
      flexDirection="column"
      borderRight="1px"
      borderColor="gray.200"
      backgroundColor="gray.50"
    >
      <Flex
        h="24"
        alignItems="center"
        justifyContent="space-between"
        px="3"
        borderBottom="1px"
        borderColor="gray.200"
        flexShrink={0}
      >
        <Heading size="md">Lists</Heading>
        <Button onClick={handleCreateList} size="sm">
          Create
        </Button>
      </Flex>
      <Flex flexDirection="column" overflowY="auto" flexGrow={1}>
        {loading || !lists ? (
          <Flex height="100%" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : lists.length === 0 ? (
          <EmptyState />
        ) : (
          lists.map((list) => (
            <ListItem
              key={list.id}
              list={list}
              selectedListId={selectedListId}
              setSelectedListId={setSelectedListId}
              onEditList={onEditList}
            />
          ))
        )}
      </Flex>
      {listToEdit && (
        <ListModal
          key={editedListId}
          isEditing={true}
          listToEdit={listToEdit}
          isOpen={isEditListOpen}
          onClose={onEditListClose}
        />
      )}
    </Flex>
  );
}
