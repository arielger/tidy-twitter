import React from "react";
import styled from "@emotion/styled";
import {
  Heading,
  Text,
  Button,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  BiDotsVerticalRounded,
  BiPencil,
  BiTrashAlt,
  BiLink,
} from "react-icons/bi";

function getColorFromString(str, alpha = 1) {
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

// @TODO: Complete EmptyState
function EmptyState() {}

export default function ListsList({
  lists,
  selectedListId,
  setSelectedListId,
}) {
  return (
    <Flex
      width="xs"
      maxWidth="xs"
      flexDirection="column"
      borderRight="1px"
      borderColor="gray.200"
    >
      <Flex
        h="24"
        alignItems="center"
        justifyContent="space-between"
        px="3"
        borderBottom="1px"
        borderColor="gray.200"
        flexShrink="0"
      >
        <Heading size="md">Lists</Heading>
        <Button size="sm">Create</Button>
      </Flex>
      <Flex flexDirection="column" overflowY="auto" flexGrow="1">
        {lists.map((list) => {
          const listColor = getColorFromString(list.name);
          const listHoverColor = getColorFromString(list.name, 0.3);
          const isActive = list.id === selectedListId;

          return (
            <Box position="relative" key={list.id}>
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
                {/* @TODO: Implement functionality */}
                <MenuList>
                  <MenuItem icon={<BiPencil />}>Rename</MenuItem>
                  <MenuItem icon={<BiTrashAlt />}>Delete</MenuItem>
                  <MenuItem icon={<BiLink />}>Open in Twiter</MenuItem>
                </MenuList>
              </Menu>
              <Flex
                as="button"
                p="3"
                w="100%"
                borderBottom="1px"
                borderColor="gray.200"
                borderLeftWidth="4px"
                _hover={{
                  borderLeftColor: isActive ? listColor : listHoverColor,
                }}
                _focus={{
                  boxShadow: "outline",
                  outline: "none",
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
                <Box ml="3" flexGrow="1">
                  <Heading size="sm" mb="1" wordBreak="break-word">
                    {list.name}
                  </Heading>
                  <Text color="gray.500">{list.member_count} members</Text>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}
