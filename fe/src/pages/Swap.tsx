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
  useToast,
  position,
} from '@chakra-ui/react';

import { SettingsIcon, ArrowDownIcon } from '@chakra-ui/icons';
import SwapButton, { AlertButton } from './../components/SwapButton';
import TokenSelect from './../components/TokenSelect';
import React, { useState } from 'react';
import theme from '../theme';
import tokens, { Token } from './../abi/tokens';
import { useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { DECIMALS, SLIPPAGE } from '../constant';
import { BigNumber, ethers } from 'ethers';
import xlpABI from '../abi/XLP.json';
import tokenABI from '../abi/Token.json';
import { useSwapAmountOut } from '../hooks/useSwapAmountOut';
import SwapDetail from '../components/SwapDetail';
import { getErrorMessage, notify } from '../utils/notify';

declare let window: any;
export default function Swap() {
  const toast = useToast();
  const { account } = useEthers();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApproveInToken, setLoadingApproveInToken] = useState(false);
  const [loadingApproveOutToken, setLoadingApproveOutToken] = useState(false);
  const [inToken, setInToken] = useState<Token>(tokens[0]);
  const [outToken, setOutToken] = useState<Token>(tokens[1]);
  const [swapAmountIn, setSwapAmountIn] = useState<string | undefined>('');
  const balanceInputToken = useTokenBalance(inToken?.address, account);
  const balanceOutputToken = useTokenBalance(outToken?.address, account);
  const allowanceInToken = useTokenAllowance(
    inToken.address,
    account,
    tokens[2].address
  );
  const allowanceOutToken = useTokenAllowance(
    outToken.address,
    account,
    tokens[2].address
  );

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

  const onClickSwapArrow = () => {
    setInToken(outToken);
    setOutToken(inToken);
  };

  const onClickMaxButton = () => {
    balanceInputToken &&
      setSwapAmountIn(formatUnits(balanceInputToken, DECIMALS));
  };

  const onApprove = async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ) => {
    try {
      tokenAddress === inToken.address
        ? setLoadingApproveInToken(true)
        : setLoadingApproveOutToken(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const tx = await tokenContract.approve(
        spenderAddress,
        parseUnits(amount, DECIMALS)
      );
      // notify transaction submited
      notify(toast, 'Transaction is submited', 'success');
      await tx.wait();
      // notify approve success
      notify(toast, 'Approve sucessfully', 'success');
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, 'error');
    } finally {
      tokenAddress === inToken.address
        ? setLoadingApproveInToken(false)
        : setLoadingApproveOutToken(false);
    }
  };

  const onSwapToken = async () => {
    if (!inToken || !outToken) return;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let xlpContract = new ethers.Contract(tokens[2].address, xlpABI, signer);
      if (swapAmountIn) {
        const tx = await xlpContract.swap(
          inToken.address,
          outToken.address,
          parseUnits(swapAmountIn, DECIMALS),
          swapAmountOut?.mul((1 - SLIPPAGE) * 1000).div(1000) // slippage = 0.5 => 0.5 * 1000/1000 = 500/1000
        );
        // notify transaction submit
        notify(toast, 'Transaction is submited', 'success');
        await tx.wait();
        // notify swap success
        notify(toast, 'Swap sucessfully', 'success');
      }
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, 'error');
    } finally {
      setLoading(false);
    }
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
              {allowanceInToken &&
                swapAmountIn &&
                allowanceInToken.lt(parseUnits(swapAmountIn, DECIMALS)) && (
                  <Box>
                    <Button
                      isLoading={loadingApproveInToken}
                      loadingText="Aprroving"
                      colorScheme="pink"
                      variant="link"
                      size="xs"
                      onClick={() =>
                        onApprove(
                          inToken.address,
                          tokens[2].address,
                          swapAmountIn
                        )
                      }
                    >
                      Approve
                    </Button>
                  </Box>
                )}
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
                  value={swapAmountIn}
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
                <Button
                  onClick={onClickMaxButton}
                  colorScheme="pink"
                  variant="link"
                  size="sm"
                >
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
            onClick={onClickSwapArrow}
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
              {/* {allowanceOutToken &&
                swapAmountOut &&
                allowanceOutToken.lt(swapAmountOut) && (
                  <Box>
                    <Button
                      isLoading={loadingApproveOutToken}
                      loadingText="Aprroving"
                      colorScheme="pink"
                      variant="link"
                      size="xs"
                      onClick={() =>
                        onApprove(
                          outToken.address,
                          tokens[2].address,
                          formatUnits(swapAmountOut, DECIMALS)
                        )
                      }
                    >
                      Approve
                    </Button>
                  </Box>
                )} */}
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
            </Flex>
          </VStack>
        </Flex>
        <Box mt="-.5rem" px="1rem" color="black">
          <Text as="em">
            1 {outToken?.name} = {rate ? rate : '--'} {inToken?.name}
          </Text>
        </Box>
        <SwapDetail
          slippage={SLIPPAGE + ''}
          expectedAmountOut={
            swapAmountOut ? formatUnits(swapAmountOut, DECIMALS) : ''
          }
          currentAMountOut={
            swapAmountOut ? formatUnits(swapAmountOut, DECIMALS) : ''
          }
        />
        {swapAmountIn &&
        balanceInputToken &&
        parseUnits(swapAmountIn, DECIMALS).gt(balanceInputToken) ? (
          <AlertButton
            text={`Insufficient ${inToken?.name} balance`}
          ></AlertButton>
        ) : (
          <SwapButton onSwap={onSwapToken} loadingSwap={loading} />
        )}
      </Box>
    </Box>
  );
}
