import { Flex, Link, Text, Box, Divider } from '@chakra-ui/react';

export default function UniMenu() {
  return (
    <Box
      w="30.62rem"
      mx="auto"
      mt="2.25rem"
      borderRadius="1.37rem"
      align="center"
    >
      <Flex
        align="center"
        justifyContent="space-between"
        bg="white"
        borderRadius="0.75rem"
        h="2rem"
        w="10rem"
        pos="relative"
        top="-5.5rem"
        mb="-5rem"
      >
        <Text fontSize="1xl" p="1rem">
          <Link href="/swap">Swap</Link>
        </Text>
        <Divider orientation="vertical" />
        <Text fontSize="1xl" p="1rem">
          <Link href="/pool">Pool</Link>
        </Text>
      </Flex>
    </Box>
  );
}
