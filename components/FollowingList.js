import React from "react";
import { Flex, Heading, Avatar, Text } from "@chakra-ui/react";

export default function FollowingList({ users, selectedList }) {
  return (
    <Flex as="main" justify="center" flexGrow="1" flexDirection="column">
      <Heading
        px="3"
        py="6"
        borderBottom="1px"
        borderColor="gray.200"
        size="md"
      >
        {selectedList ? selectedList.name : "All following"}
      </Heading>
      <Flex as="ul" overflow="auto" flexDirection="column">
        {users.map(({ id, profile_image_url, name, screen_name }) => (
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
        ))}
      </Flex>
    </Flex>
  );
}
