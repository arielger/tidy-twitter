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

export default function Sidebar() {
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
        {/* @TODO: Use user real data instead of mock */}
        <Avatar
          name="Ryan Florence"
          src="https://bit.ly/ryan-florence"
          mr="3"
        ></Avatar>
        <Flex flexDirection="column" mb="8">
          <Text>Ryan Florence</Text>
          <Text>@ryan.florence</Text>
        </Flex>
      </Flex>
      <VStack alignItems="stretch" spacing="2">
        <ActiveNextLink href="/dashboard/following" passHref>
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
            <Icon as={BiGroup} mr="2" boxSize="6" color="gray.500"></Icon>
            Following
          </Link>
        </ActiveNextLink>
        {/* @TODO: Show lists link when screen is ready */}
        {/* <ActiveNextLink href="/dashboard/lists" passHref>
          <Link
            p="2"
            borderRadius="md"
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
        </ActiveNextLink> */}
      </VStack>
    </Box>
  );
}
