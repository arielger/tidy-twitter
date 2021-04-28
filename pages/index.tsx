import Head from "next/head";
import Link from "next/link";
import { Heading, Text, Button, Box, Flex } from "@chakra-ui/react";
import { useMutation } from "react-query";

import { useAuth } from "../modules/auth";
import { fetchTwitterRequestToken } from "../utils/api";

export default function Home() {
  const {
    value: { isAuthenticated },
  } = useAuth();

  const fetchTokenMutation = useMutation(() =>
    fetchTwitterRequestToken().then(({ requestToken }) => {
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken}`;
    })
  );

  return (
    <div>
      <Head>
        <title>Tidy Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex as="main" justify="center" mt="40">
        <Box maxW="32rem">
          <Heading
            size="sm"
            textTransform="uppercase"
            letterSpacing="wide"
            mb="8"
          >
            Tidy twitter
          </Heading>
          <Heading size="2xl" mb="4">
            Take control back of your Twitter feed.
          </Heading>
          <Text fontSize="xl" mb="8">
            Tidy Twitter lets you organize your followings into lists in a
            breeze.
          </Text>
          {isAuthenticated ? (
            <Link href="/dashboard/lists">
              <Button size="lg" colorScheme="twitter">
                Go to the dashboard
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => fetchTokenMutation.mutate()}
              isLoading={fetchTokenMutation.isLoading}
              loadingText="Connecting with Twitter"
              size="lg"
              colorScheme="twitter"
            >
              Connect with Twitter
            </Button>
          )}
        </Box>
      </Flex>
    </div>
  );
}
