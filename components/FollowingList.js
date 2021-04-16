import React from "react";
import {
  Box,
  Flex,
  Heading,
  Avatar,
  Text,
  Icon,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { BiGroup, BiUserPlus } from "react-icons/bi";

export default function FollowingList({
  loading,
  error,
  users,
  selectedList,
  handleAddMembers,
}) {
  return (
    <Flex as="main" flexGrow="1" flexDirection="column">
      <Flex
        h="24"
        px="4"
        alignItems="center"
        borderBottom="1px"
        borderColor="gray.200"
        flexShrink="0"
      >
        <Heading size="md" mr="8">
          {selectedList && selectedList.name}
        </Heading>
        {Boolean(selectedList) && (
          <Box>
            <Icon as={BiGroup} mr="2"></Icon>
            {selectedList.member_count}{" "}
            {selectedList.member_count === 1 ? "member" : "members"}
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
      <Flex as="ul" overflow="auto" flexDirection="column" flexGrow="1">
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
        ) : loading ? (
          <Flex height="100%" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : (
          users &&
          users.map(({ id, profile_image_url, name, screen_name }) => (
            <Flex key={id} borderBottom="1px" borderColor="gray.200" p="3">
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
          ))
        )}
      </Flex>
    </Flex>
  );
}
