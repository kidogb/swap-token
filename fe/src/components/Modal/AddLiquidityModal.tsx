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
import { useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import theme from '../../theme';
import TokenSelect from '../TokenSelect';
import { useState } from 'react';
import tokens, { Token } from '../../abi/tokens';
import xlpABI from './../../abi/XLP.json';
import tokenABI from './../../abi/Token.json';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { DECIMALS } from '../../constant';
import { BigNumber, ethers } from 'ethers';

type Props = {
  isOpen: any;
  onClose: any;
};

declare let window: any;

export default function AddLiquidityModal({ isOpen, onClose }: Props) {
  const { account } = useEthers();
  const token0 = tokens[0];
  const token1 = tokens[1];
  const [amountToken0, setAmountToken0] = useState<string | undefined>('');
  const [amountToken1, setAmountToken1] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);
  const [loadingApprove0, setLoadingApprove0] = useState(false);
  const [loadingApprove1, setLoadingApprove1] = useState(false);
  const balanceToken0 = useTokenBalance(token0?.address, account);
  const balanceToken1 = useTokenBalance(token1?.address, account);
  const poolBalanceToken0 = useTokenBalance(token0?.address, tokens[2].address);
  const poolBalanceToken1 = useTokenBalance(token1?.address, tokens[2].address);

  const allowanceA = useTokenAllowance(
    token0.address,
    account,
    tokens[2].address
  );
  const allowanceB = useTokenAllowance(
    token1.address,
    account,
    tokens[2].address
  );

  const onChangeAmountToken0 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountToken0(value);
    if (poolBalanceToken0 && poolBalanceToken1 && value) {
      if (!poolBalanceToken0.isZero()) {
        const estimateAmountToken1 = poolBalanceToken1
          .mul(parseUnits(value, DECIMALS))
          .div(poolBalanceToken0);
        setAmountToken1(formatUnits(estimateAmountToken1, DECIMALS));
        console.log('E', formatUnits(estimateAmountToken1 || '0', DECIMALS));
      }
    }
  };

  const onChangeAmountToken1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountToken1(value);
    if (poolBalanceToken0 && poolBalanceToken1 && value) {
      if (!poolBalanceToken1.isZero()) {
        const estimateAmountToken0 = poolBalanceToken0
          .mul(parseUnits(value, DECIMALS))
          .div(poolBalanceToken1);
        setAmountToken0(formatUnits(estimateAmountToken0, DECIMALS));
        console.log('E', formatUnits(estimateAmountToken0 || '0', DECIMALS));
      }
    }
  };

  const onClickMaxButton0 = () => {
    balanceToken0 && setAmountToken0(formatUnits(balanceToken0, DECIMALS));
  };

  const onClickMaxButton1 = () => {
    balanceToken1 && setAmountToken1(formatUnits(balanceToken1, DECIMALS));
  };

  const clearForm = () => {
    setAmountToken0('');
    setAmountToken1('');
  };

  const onCloseModal = () => {
    clearForm();
    onClose();
  };

  const onApprove = async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ) => {
    try {
      tokenAddress === token0.address
        ? setLoadingApprove0(true)
        : setLoadingApprove1(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const tx = await tokenContract.approve(
        spenderAddress,
        parseUnits(amount, DECIMALS)
      );
      await tx.wait();
    } catch (err) {
      console.log(err);
    } finally {
      tokenAddress === token0.address
        ? setLoadingApprove0(false)
        : setLoadingApprove1(false);
    }
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
          parseUnits(amountToken1, DECIMALS),
          BigNumber.from('0'),
          BigNumber.from('0')
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
    <Modal isOpen={isOpen} onClose={onCloseModal} isCentered size="lg">
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
                  {allowanceA &&
                    amountToken0 &&
                    allowanceA.lt(parseUnits(amountToken0, DECIMALS)) && (
                      <Box>
                        <Button
                          isLoading={loadingApprove0}
                          loadingText="Aprroving"
                          onClick={() =>
                            onApprove(
                              token0.address,
                              tokens[2].address,
                              amountToken0
                            )
                          }
                          colorScheme="pink"
                          variant="link"
                          size="xs"
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
                  {allowanceB &&
                    amountToken1 &&
                    allowanceB.lt(parseUnits(amountToken1, DECIMALS)) && (
                      <Box>
                        <Button
                          isLoading={loadingApprove1}
                          loadingText="Aprroving"
                          onClick={() =>
                            onApprove(
                              token1.address,
                              tokens[2].address,
                              amountToken1
                            )
                          }
                          colorScheme="pink"
                          variant="link"
                          size="sm"
                        >
                          Approve
                        </Button>
                      </Box>
                    )}
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
