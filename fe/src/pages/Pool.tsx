import {
  Flex,
  Box,
  Text,
  Button,
  Image,
  Center,
  Badge,
  Spacer,
} from '@chakra-ui/react';

import { SettingsIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import theme from '../theme';
import tokens, { Token } from './../abi/tokens';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { DECIMALS } from '../constant';

declare let window: any;
export default function Pool() {
  const { account } = useEthers();

  const balanceAToken = useTokenBalance(tokens[0].address, tokens[2].address);
  const balanceBToken = useTokenBalance(tokens[1].address, tokens[2].address);

  return (
    <Box
      w="50.62rem"
      mx="auto"
      mt="2.25rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
    >
      <Flex
        alignItems="center"
        p="1rem 1.25rem 0.5rem"
        bg="white"
        color="rgb(86, 90, 105)"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        <Text color="black" fontWeight="500">
          Pool
        </Text>
        <SettingsIcon
          fontSize="1.25rem"
          cursor="pointer"
          _hover={{ color: 'rgb(128,128,128)' }}
        />
      </Flex>

      <Box p="0.5rem" bg="white" borderRadius="0 0 1.37rem 1.37rem">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg={theme.colors.gray_light}
          p="1rem 1rem 1.7rem"
          borderRadius="1.25rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: '0.06rem solid rgb(211,211,211)' }}
        >
          <Box>
            <Flex p="1rem" w="100%">
              <Image src={tokens[2].icon} w="2.5rem"></Image>
              <Text px="1rem" as="b">
                {`${tokens[0].name} / ${tokens[1].name}`.toUpperCase()}
              </Text>
            </Flex>
            <Center>
              <Button
                mr="0.5rem"
                bg={theme.colors.gray_light}
                color={theme.colors.gray_text}
                fontSize="1rem"
                fontWeight="semibold"
                borderRadius="xl"
                border={`0.06rem solid ${theme.colors.gray_dark}`}
                _hover={{
                  borderColor: theme.colors.gray_light,
                  bg: theme.colors.gray_dark,
                }}
                _active={{
                  borderColor: theme.colors.gray_light,
                }}
              >
                Add Liquidity
              </Button>
              <Button
                bg={theme.colors.pink_dark}
                color={theme.colors.pink_light}
                fontSize="1rem"
                fontWeight="semibold"
                borderRadius="xl"
                border="0.06rem solid rgb(253, 234, 241)"
                _hover={{
                  borderColor: theme.colors.pink_dark,
                  bg: theme.colors.pink_dark_hover,
                }}
                _active={{
                  borderColor: theme.colors.pink_dark,
                }}
              >
                Remove Liquidity
              </Button>
            </Center>
          </Box>
          <Box
            borderRadius="0.75rem"
            border="0.06rem solid rgb(237, 238, 242)"
            _hover={{ border: '0.06rem solid rgb(211,211,211)' }}
            direction={['row', 'column']}
            p="1rem"
          >
            <Flex p="1rem" direction={['column', 'row']}>
              <Image
                boxSize="1.5rem"
                src={tokens[0].icon}
                alt="Logo"
                mr="0.1rem"
              />
              <Text noOfLines={1} px="1rem" as="samp">
                {tokens[0].name.toUpperCase()}:{' '}
                {balanceAToken
                  ? Math.round(
                      parseFloat(formatUnits(balanceAToken, DECIMALS)) * 1e16
                    ) / 1e16
                  : '--'}
              </Text>

              <Badge variant="outline">50%</Badge>
            </Flex>
            <Flex p="1rem" direction={['column', 'row']}>
              <Image
                boxSize="1.5rem"
                src={tokens[1].icon}
                alt="Logo"
                mr="0.1rem"
              />
              <Text noOfLines={1} px="1rem" as="samp">
                {tokens[1].name.toUpperCase()}:{' '}
                {balanceBToken
                  ? Math.round(
                      parseFloat(formatUnits(balanceBToken, DECIMALS)) * 1e16
                    ) / 1e16
                  : '--'}
              </Text>
              <Badge variant="outline">50%</Badge>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
