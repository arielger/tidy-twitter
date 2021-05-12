import React from "react";
import {
  Button,
  Heading,
  Link,
  Avatar,
  Text,
  Icon,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { BiListUl, BiLogOut } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";

import { useAuth } from "../modules/auth";
import ActiveNextLink from "./ActiveNextLink";

import { User } from "../types";

type props = {
  user?: User;
};

export default function Sidebar({ user }: props) {
  const {
    actions: { handleLogOut },
  } = useAuth();

  return (
    <Flex
      flexDirection="column"
      w="72"
      height="full"
      backgroundColor="gray.800"
      color="gray.50"
      px="4"
      py="5"
      borderColor="gray.200"
    >
      <Heading display="flex" alignItems="center" size="md" mb="8">
        <Icon as={FaTwitter} color="#1DA1F2" mr="2"></Icon>
        <Text size="sm">Tidy twitter</Text>
      </Heading>
      <Flex>
        <Avatar
          name={user?.name}
          src={user?.profile_image_url.replace("normal", "bigger")}
          mr="3"
        ></Avatar>
        <Flex flexDirection="column" mb="8">
          <Text>{user?.name}</Text>
          <Text>@{user?.screen_name}</Text>
        </Flex>
      </Flex>
      <VStack alignItems="stretch" spacing="2">
        <ActiveNextLink href="/dashboard">
          <Link
            p="2"
            borderRadius="md"
            backgroundColor="gray.900"
            display="flex"
            alignItems="center"
            _hover={{
              backgroundColor: "gray.900",
              textDecoration: "none",
            }}
          >
            <Icon as={BiListUl} mr="2" boxSize="6" color="gray.500"></Icon>
            Lists
          </Link>
        </ActiveNextLink>
      </VStack>
      <Button
        onClick={handleLogOut}
        variant="unstyled"
        isFullWidth
        p="2"
        borderRadius="md"
        display="flex"
        fontSize="md"
        justifyContent="left"
        fontWeight="normal"
        mt="auto"
        _hover={{
          backgroundColor: "gray.900",
        }}
      >
        <Icon as={BiLogOut} mr="2" boxSize="6" color="gray.500"></Icon>
        Log out
      </Button>
    </Flex>
  );
}
