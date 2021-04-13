import Twit from "twit";
import Cookies from "cookies";
import { useState, useEffect } from "react";
// import Head from "next/head";
import { Heading, Text, Avatar, Box, Flex } from "@chakra-ui/react";

import { API_URL } from "../../utils/env-variables";

import Sidebar from "../../components/Sidebar";
import ListsList from "../../components/ListsList";
import FollowingLists from "../../components/FollowingList";

// @TODO: Prevent showing dashboard if user is not logged in

export default function Home({ user, followers, lists }) {
  const [selectedListId, setSelectedListId] = useState();

  useEffect(() => {
    if (selectedListId) {
      fetch(`${API_URL}/list-members/${selectedListId}`)
        .then((response) => response.json())
        .then((data) => console.log("data", data));
    }
  }, [selectedListId]);

  return (
    <Flex height="100vh" flexDir="row" overflow="hidden">
      <Sidebar user={user} />
      <ListsList
        lists={lists}
        selectedListId={selectedListId}
        setSelectedListId={setSelectedListId}
      />
      <FollowingLists
        users={followers}
        selectedList={lists.find((list) => list.id === selectedListId)}
      />
    </Flex>
  );
}

export async function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res);

  const twitterAccessToken = cookies.get("twitterAccessToken");
  const twitterAccessTokenSecret = cookies.get("twitterAccessTokenSecret");

  // @TODO: Review best auth solution
  // If user is not logged in
  if (!twitterAccessToken || !twitterAccessTokenSecret) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: twitterAccessToken,
    access_token_secret: twitterAccessTokenSecret,
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

  const lists = rawLists.data
    .map(({ id_str, name, uri, mode, member_count, created_at }) => ({
      id: id_str, // Use id_str instead of id, which is returning wrong number
      name,
      uri,
      mode,
      member_count,
      created_at,
    }))
    // Sort by member count DESC
    .sort((listA, listB) => listB.member_count - listA.member_count);

  return { props: { user, followers, lists } };
}
