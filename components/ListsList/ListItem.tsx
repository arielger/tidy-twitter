import { useCallback } from "react";
import styled from "@emotion/styled";
import {
  Heading,
  Text,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import {
  BiDotsVerticalRounded,
  BiPencil,
  BiTrashAlt,
  BiLink,
} from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";

import { deleteList } from "../../utils/api";
import { List } from "../../types";

function getColorFromString(str: string, alpha = 1) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsla(${hash % 360}, 100%, 45%, ${alpha * 100}%)`;
}

const ColorCircle = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color || "grey"};
  margin-top: 5px;
`;

type props = {
  list: List;
  selectedListId?: string;
  setSelectedListId: (listID: string) => void;
  onEditList: (listID: string) => void;
};

export default function ListItem({
  list,
  selectedListId,
  setSelectedListId,
  onEditList,
}: props) {
  const listColor = getColorFromString(list.name);
  const isActive = list.id === selectedListId;

  const toast = useToast();
  const queryClient = useQueryClient();

  const handleOpenInTwitter = useCallback((listId) => {
    window.open(`https://twitter.com/i/lists/${listId}`, "_blank");
  }, []);

  const deleteListMutation = useMutation(deleteList, {
    // Optimistic update
    onMutate: (deletedListId: string) => {
      const oldList = queryClient.getQueryData<List[]>("lists");
      queryClient.setQueryData<List[]>("lists", (lists) =>
        (lists || [])?.filter((list) => list.id !== deletedListId)
      );
      return { oldList };
    },
    onError: (err, variables, context) => {
      toast({
        title: "Error deleting list",
        status: "error",
        isClosable: true,
      });

      if (context?.oldList) {
        queryClient.setQueryData("lists", context.oldList);
      }
    },
    onSuccess: () => {
      toast({
        title: "List deleted",
        status: "success",
        isClosable: true,
      });
    },
  });

  return (
    <Box position="relative">
      {/* Move menu outside list item to prevent <button> cannot appear as a descendant of <button> error */}
      <Menu placement="right-start" preventOverflow={false}>
        <MenuButton
          position="absolute"
          right="10px"
          top="10px"
          aria-label="List menu"
          as={IconButton}
          icon={<BiDotsVerticalRounded />}
          variant="ghost"
        ></MenuButton>
        <MenuList>
          <MenuItem onClick={() => onEditList(list.id)} icon={<BiPencil />}>
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => deleteListMutation.mutate(list.id)}
            icon={<BiTrashAlt />}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => handleOpenInTwitter(list.id)}
            icon={<BiLink />}
          >
            Open in Twiter
          </MenuItem>
        </MenuList>
      </Menu>
      <Flex
        as="button"
        p="3"
        w="100%"
        height="72px"
        borderBottom="1px"
        borderColor="gray.200"
        borderLeftWidth="6px"
        _hover={{
          borderLeftColor: isActive ? listColor : "transparent",
          backgroundColor: "gray.100",
        }}
        _focus={{
          outline: "none",
          borderLeftColor: isActive ? listColor : "transparent",
          backgroundColor: "gray.100",
        }}
        _active={{
          borderLeftColor: listColor,
          outline: "none",
        }}
        borderLeftColor={isActive ? listColor : "transparent"}
        textAlign="left"
        onClick={() => {
          setSelectedListId(list.id);
        }}
      >
        <ColorCircle color={listColor} />
        <Box ml="3" flexGrow={1}>
          <Heading size="sm" mb="1" wordBreak="break-word">
            {list.name}
          </Heading>
          <Text color="gray.500">{list.member_count} members</Text>
        </Box>
      </Flex>
    </Box>
  );
}
