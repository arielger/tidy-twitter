import React from "react";
import {
  Box,
  Heading,
  Link,
  Avatar,
  Text,
  Icon,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { BiGroup, BiListUl } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";

import ActiveNextLink from "./ActiveNextLink";

import { User } from "../types";

type props = {
  user: User;
};

export default function Sidebar({ user }: props) {
  return (
    <Box
      w="72"
      height="full"
      backgroundColor="gray.100"
      p="3"
      pt="5"
      borderRight="1px"
      borderColor="gray.200"
    >
      <Heading display="flex" alignItems="center" size="md" mb="8">
        <Icon as={FaTwitter} color="#1DA1F2" mr="2"></Icon>
        <Text size="sm">Tidy twitter</Text>
      </Heading>
      <Flex>
        <Avatar
          name={user.name}
          src={user.profile_image_url.replace("normal", "bigger")}
          mr="3"
        ></Avatar>
        <Flex flexDirection="column" mb="8">
          <Text>{user.name}</Text>
          <Text>@{user.screen_name}</Text>
        </Flex>
      </Flex>
      <VStack alignItems="stretch" spacing="2">
        <ActiveNextLink href="/dashboard/lists">
          <Link
            p="2"
            borderRadius="md"
            backgroundColor="gray.200"
            display="flex"
            alignItems="center"
            _hover={{
              backgroundColor: "gray.200",
              textDecoration: "none",
            }}
          >
            <Icon as={BiListUl} mr="2" boxSize="6" color="gray.500"></Icon>
            Lists
          </Link>
        </ActiveNextLink>
      </VStack>
    </Box>
  );
}
