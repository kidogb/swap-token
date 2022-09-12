import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Input,
  Spacer,
} from '@chakra-ui/react';
import { ExternalLinkIcon, CopyIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { useEthers, useTokenBalance } from '@usedapp/core';
import theme from '../../theme';
import TokenSelect from '../TokenSelect';
import { useState } from 'react';
import tokens, { Token } from '../../abi/tokens';
import xlpABI from './../../abi/XLP.json';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { DECIMALS } from '../../constant';
import { ethers } from 'ethers';

type Props = {
  isOpen: any;
  onClose: any;
};

declare let window: any;

export default function AddLiquidityModal({ isOpen, onClose }: Props) {
  const { account } = useEthers();
  const token0 = tokens[0];
  const token1 = tokens[1];
  const [amountToken0, setAMountToken0] = useState<string | undefined>('');
  const [amountToken1, setAmountToken1] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);
  const balanceToken0 = useTokenBalance(token0?.address, account);
  const balanceToken1 = useTokenBalance(token1?.address, account);
  const poolBalanceToken0 = useTokenBalance(token0?.address, tokens[2].address);
  const poolBalanceToken1 = useTokenBalance(token1?.address, tokens[2].address);

  const onChangeAmountToken0 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAMountToken0(value);
    console.log('Estimate: ', formatUnits(poolBalanceToken1 || '0', DECIMALS));
    const estimateAmountToken1 =
      poolBalanceToken0 &&
      poolBalanceToken1 &&
      value &&
      poolBalanceToken1.mul(parseUnits(value, DECIMALS)).div(poolBalanceToken0);
    console.log('E', formatUnits(estimateAmountToken1 || '0', DECIMALS));
    estimateAmountToken1 &&
      setAmountToken1(formatUnits(estimateAmountToken1, DECIMALS));
  };
  const onChangeAmountToken1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToken1(e.target.value);
  };

  const onClickMaxButton0 = () => {
    balanceToken0 && setAMountToken0(formatUnits(balanceToken0, DECIMALS));
  };

  const onClickMaxButton1 = () => {
    balanceToken1 && setAmountToken1(formatUnits(balanceToken1, DECIMALS));
  };

  const onAddLiquidity = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let xlpContract = new ethers.Contract(tokens[2].address, xlpABI, signer);
      if (amountToken0 && amountToken1) {
        const tx = await xlpContract.addLiquidity(
          parseUnits(amountToken0, DECIMALS),
          parseUnits(amountToken1, DECIMALS)
        );
        await tx.wait();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        background="white"
        border="0.06rem"
        borderStyle="solid"
        borderColor="gray.300"
        borderRadius="3xl"
      >
        <ModalHeader color="black" px={4} fontSize="lg" fontWeight="medium">
          Add Liquidity
        </ModalHeader>
        <ModalCloseButton
          color="black"
          fontSize="sm"
          _hover={{
            color: 'gray.600',
          }}
        />
        <ModalBody pt={0} px={4}>
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
                      image={token0?.icon || ''}
                      value={token0?.name || ''}
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
                      value={amountToken0}
                      onChange={onChangeAmountToken0}
                    />
                  </Box>
                </HStack>

                <Flex w="100%">
                  <Box px={5}>
                    <Text noOfLines={1} mt=".25rem" fontSize="sm" as="samp">
                      Balance:{' '}
                      {balanceToken0
                        ? formatUnits(balanceToken0, DECIMALS)
                        : '--'}
                    </Text>
                  </Box>
                  <Spacer />
                  <Box px="1rem">
                    <Button
                      onClick={onClickMaxButton0}
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
              mt="1rem"
              alignItems="center"
              justifyContent="space-between"
              bg={theme.colors.gray_light}
              pos="relative"
              p="1rem 1rem 1.7rem"
              borderRadius="1.25rem"
              border="0.06rem solid rgb(237, 238, 242)"
              _hover={{ border: '0.06rem solid rgb(211,211,211)' }}
            >
              <VStack align="start">
                <HStack>
                  <Box>
                    <TokenSelect
                      image={token1?.icon || ''}
                      value={token1?.name || ''}
                      button="button1"
                    />
                  </Box>
                  <Box>
                    <Input
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
                      value={amountToken1}
                      onChange={onChangeAmountToken1}
                    />
                  </Box>
                </HStack>
                <Flex w="100%">
                  <Box px="1rem">
                    <Text noOfLines={1} mt=".25rem" fontSize="sm" as="samp">
                      Balance:{' '}
                      {balanceToken1
                        ? formatUnits(balanceToken1, DECIMALS)
                        : '--'}
                    </Text>
                  </Box>
                  <Spacer />
                  <Box px="1rem">
                    <Button
                      onClick={onClickMaxButton1}
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
            <Box mt="1.0rem" color="black">
              <Text as="b">*Current Pool Balance</Text>
              <br />
              <Text as="samp" size="sm" color={theme.colors.gray_text}>
                {`${token0.name}: ${
                  poolBalanceToken0
                    ? formatUnits(poolBalanceToken0, DECIMALS)
                    : '--'
                }`}
              </Text>
              <br />
              <Text as="samp" size="sm" color={theme.colors.gray_text}>
                {`${token1.name}: ${
                  poolBalanceToken1
                    ? formatUnits(poolBalanceToken1, DECIMALS)
                    : '--'
                }`}
              </Text>
            </Box>
            <Box mt="1.5rem">
              <Button
                size="lg"
                color="white"
                bg={theme.colors.pink_dark}
                width="100%"
                p="1.62rem"
                borderRadius="1.25rem"
                _hover={{ bg: theme.colors.pink_dark_hover }}
                isLoading={loading}
                loadingText="Adding"
                onClick={onAddLiquidity}
              >
                Add
              </Button>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="flex-start"
          background="rgb(237, 238, 242)"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          {/* <Text color="black" fontWeight="medium" fontSize="md"></Text> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
