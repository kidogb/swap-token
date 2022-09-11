import {
  Flex,
  Box,
  Text,
  Button,
  Input,
  useDisclosure,
  VStack,
  HStack,
  Spacer,
} from '@chakra-ui/react';

import { SettingsIcon, ArrowDownIcon } from '@chakra-ui/icons';
import SwapButton from './../components/SwapButton';
import TokenSelect from './../components/TokenSelect';
import React, { useContext, useState } from 'react';
import theme from '../theme';
import tokens, { Token } from './../abi/tokens';
import { useTokenBalance } from '@usedapp/core';
import AppContext from '../AppContext';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';
import { DECIMALS } from '../constant';
import { ethers } from 'ethers';
import xlpABI from '../abi/XLP.json';
import { useSwapAmountOut } from '../hooks/useSwapAmountOut';

export default function Swap() {
  // const [value, setValue] = useState<number>(0);

  const { account } = useContext(AppContext);

  const [inToken, setInToken] = useState<Token | undefined>(tokens[0]);
  const [outToken, setOutToken] = useState<Token | undefined>(tokens[1]);
  const [swapAmountIn, setSwapAmountIn] = useState<string | undefined>();
  const balanceInputToken = useTokenBalance(inToken?.address, account);
  const balanceOutputToken = useTokenBalance(outToken?.address, account);
  const swapAmountOut = useSwapAmountOut(
    tokens[2].address,
    new ethers.utils.Interface(xlpABI),
    inToken?.address || '',
    outToken?.address || '',
    swapAmountIn ? parseUnits(swapAmountIn, DECIMALS) : undefined
  );
  const rate =
    swapAmountOut && swapAmountIn
      ? parseFloat(swapAmountIn) /
        parseFloat(formatUnits(swapAmountOut, DECIMALS))
      : undefined;

  const onChangeAmountIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwapAmountIn(e.target.value);
  };

  const onSwapToken = () => {
    setInToken(outToken);
    setOutToken(inToken);
  };

  return (
    <Box
      w="30.62rem"
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
          Swap
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
          <VStack align="start">
            <HStack>
              <Box>
                <TokenSelect
                  image={inToken?.icon || ''}
                  value={inToken?.name || ''}
                  button="button0"
                />
              </Box>
              <Box>
                <Input
                  placeholder="0.0"
                  fontWeight="500"
                  fontSize="1.5rem"
                  width="100%"
                  size="19rem"
                  textAlign="right"
                  bg="rgb(247, 248, 250)"
                  outline="none"
                  border="none"
                  focusBorderColor="none"
                  type="number"
                  color="black"
                  onChange={onChangeAmountIn}
                />
              </Box>
            </HStack>

            <Flex w="100%">
              <Box px={5}>
                <Text noOfLines={1} mt=".25rem" fontSize="sm" as="samp">
                  Balance:{' '}
                  {balanceInputToken
                    ? formatUnits(balanceInputToken, DECIMALS)
                    : '--'}
                </Text>
              </Box>
              <Spacer />
              <Box px="1rem">
                <Button colorScheme="pink" variant="link" size="sm">
                  max
                </Button>
              </Box>
            </Flex>
          </VStack>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="transparent"
          p="0.18rem"
          borderRadius="0.75rem"
          pos="relative"
          top="-0.8rem"
          zIndex="1"
        >
          <ArrowDownIcon
            border="0.2rem solid white"
            bg={theme.colors.gray_light}
            color={theme.colors.gray_text}
            h="2rem"
            width="2rem"
            borderRadius="0.75rem"
            _hover={{ bg: theme.colors.gray_dark }}
            _active={{ bg: theme.colors.gray_light }}
            onClick={onSwapToken}
          />
        </Flex>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg={theme.colors.gray_light}
          pos="relative"
          p="1rem 1rem 1.7rem"
          borderRadius="1.25rem"
          top="-1.5rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: '0.06rem solid rgb(211,211,211)' }}
        >
          <VStack align="start">
            <HStack>
              <Box>
                <TokenSelect
                  image={outToken?.icon || ''}
                  value={outToken?.name || ''}
                  button="button1"
                />
              </Box>
              <Box>
                <Input
                  readOnly
                  placeholder="0.0"
                  fontSize="1.5rem"
                  width="100%"
                  size="19rem"
                  textAlign="right"
                  bg={theme.colors.gray_light}
                  outline="none"
                  border="none"
                  focusBorderColor="none"
                  type="number"
                  color="black"
                  value={
                    swapAmountOut ? formatUnits(swapAmountOut, DECIMALS) : ''
                  }
                />
              </Box>
            </HStack>
            <Flex w="100%">
              <Box px="1rem">
                <Text noOfLines={1} mt=".25rem" fontSize="sm" as="samp">
                  Balance:{' '}
                  {balanceOutputToken
                    ? formatUnits(balanceOutputToken, DECIMALS)
                    : '--'}
                </Text>
              </Box>
              <Spacer />
              <Box px="1rem">
                <Button colorScheme="pink" variant="link" size="sm">
                  max
                </Button>
              </Box>
            </Flex>
          </VStack>
        </Flex>
        <Box mt="-.5rem" color="black">
          <Text as="em">
            1 {outToken?.name} = {rate ? rate : '--'} {inToken?.name}
          </Text>
        </Box>
        <SwapButton />
      </Box>
    </Box>
  );
}
