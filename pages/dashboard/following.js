import { useState } from "react";
import Twit from "twit";
import Cookies from "cookies";
// import Head from "next/head";
import { Heading, Text, Avatar, Box, Flex } from "@chakra-ui/react";

import Sidebar from "../../components/Sidebar";

// @TODO: Prevent showing dashboard if user is not logged in

export default function Home({ user, followers, lists }) {
  return (
    <Flex height="100vh" flexDir="row" overflow="hidden">
      <Sidebar user={user} />
      <Flex as="main" justify="center" mt="40">
        <Box maxW="32rem">
          <Heading
            size="sm"
            textTransform="uppercase"
            letterSpacing="wide"
            mb="8"
          >
            Dashboard
          </Heading>
          <ul>
            {followers.map(({ id, profile_image_url, name, screen_name }) => (
              <Flex p="1" key={id}>
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
          </ul>
        </Box>
      </Flex>
    </Flex>
  );
}

export async function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res);

  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: cookies.get("twitterAccessToken"),
    access_token_secret: cookies.get("twitterAccessTokenSecret"),
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });

  // Api reference
  // https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friends-list

  // @TODO: Check how import all followers instead of the first 200
  const [rawUser, rawFollowers, rawLists] = await Promise.all([
    T.get("account/verify_credentials", { skip_status: true }),
    T.get("friends/list", {
      count: 200, // max count
    }),
    T.get("lists/list"),
  ]);

  const user = (({
    id,
    name,
    screen_name,
    description,
    profile_image_url,
  }) => ({
    id,
    name,
    screen_name,
    description,
    profile_image_url,
  }))(rawUser.data);

  // @TODO: Use lib method to get object keys

  const followers = rawFollowers.data.users.map(
    ({
      id,
      name,
      screen_name,
      description,
      url,
      followers_count,
      friends_count,
      created_at,
      statuses_count,
      profile_image_url,
    }) => ({
      id,
      name,
      screen_name,
      description,
      url,
      followers_count,
      friends_count,
      created_at,
      statuses_count,
      profile_image_url,
    })
  );

  const lists = rawLists.data.map(
    ({ id, name, uri, mode, member_count, created_at }) => ({
      id,
      name,
      uri,
      mode,
      member_count,
      created_at,
    })
  );

  return { props: { user, followers, lists } };
}
