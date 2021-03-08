import { useState } from "react";
import Head from "next/head";
import { Heading, Text, Button, Box, Flex } from "@chakra-ui/react";

export default function Home() {
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const logInWithTwitter = () => {
    setIsAuthLoading(true);
    fetch("http://localhost:3000/api/twitter-login")
      .then((response) => response.json())
      .then(({ requestToken }) => {
        setIsAuthLoading(false);
        window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${requestToken}`;
      });
    // @TODO: Handle error
  };

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
          <Button
            onClick={logInWithTwitter}
            isLoading={isAuthLoading}
            loadingText="Connecting with Twitter"
            size="lg"
            colorScheme="twitter"
          >
            Connect with Twitter
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
