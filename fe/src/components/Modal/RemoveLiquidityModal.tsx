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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Image,
  Spacer,
} from '@chakra-ui/react';
import { Goerli, useEthers, useTokenBalance } from '@usedapp/core';
import theme from '../../theme';
import { useEffect, useState } from 'react';
import tokens from '../../abi/tokens';
import xlpABI from './../../abi/XLP.json';

import { BigNumber, ethers } from 'ethers';
import { useTotalSupply } from '../../hooks/useTotalSupply';
import { formatUnits } from 'ethers/lib/utils';
import { DECIMALS } from '../../constant';

type Props = {
  isOpen: any;
  onClose: any;
};

type PercentProps = {
  text: string;
  onClick: () => void;
};

declare let window: any;

const PercentButton = ({ text, onClick }: PercentProps) => {
  return (
    <Button
      size="xs"
      color={theme.colors.pink_dark}
      bg={theme.colors.pink_light}
      width="100%"
      px="1rem"
      ml="1rem"
      borderRadius="1.25rem"
      _hover={{ bg: theme.colors.pink_light_hover }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default function RemoveLiquidityModal({ isOpen, onClose }: Props) {
  const { account, chainId } = useEthers();
  const [isConnected, setConnected] = useState<boolean | undefined | ''>(false);

  useEffect(() => {
    setConnected(account && chainId === Goerli.chainId);
  }, [account, chainId]);

  const token0 = tokens[0];
  const token1 = tokens[1];
  const [percentValue, setPercentValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const liquidityPoolAmount = useTotalSupply(
    tokens[2].address,
    new ethers.utils.Interface(xlpABI)
  );

  const poolBalanceToken0 = useTokenBalance(token0?.address, tokens[2].address);
  const poolBalanceToken1 = useTokenBalance(token1?.address, tokens[2].address);

  const onClickPercent = (percent: number) => {
    setPercentValue(percent * 100);
  };

  const onChangeSlider = (value: number) => {
    setPercentValue(value);
  };

  const onRemoveLiquidity = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let xlpContract = new ethers.Contract(tokens[2].address, xlpABI, signer);
      if (liquidityPoolAmount) {
        const removeLiquidity = liquidityPoolAmount.mul(percentValue).div(100);
        const tx = await xlpContract.removeLiquidity(
          BigNumber.from('0'),
          BigNumber.from('0'),
          removeLiquidity
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
          Remove Liquidity
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
              direction={['row', 'column']}
              alignItems="center"
              justifyContent="space-between"
              bg={theme.colors.gray_light}
              p="1rem 1rem 1.7rem"
              borderRadius="1.25rem"
              border="0.06rem solid rgb(237, 238, 242)"
              _hover={{ border: '0.06rem solid rgb(211,211,211)' }}
            >
              <Flex w="100%">
                <Text color={theme.colors.gray_text} fontSize="1xl">
                  Amount
                </Text>
              </Flex>

              <Flex w="100%" align="center" justifyContent="space-between">
                <Text w="50rem" as="b" fontSize="2xl">
                  {percentValue} %
                </Text>
                <PercentButton
                  text="25%"
                  onClick={() => onClickPercent(0.25)}
                />
                <PercentButton text="50%" onClick={() => onClickPercent(0.5)} />
                <PercentButton
                  text="75%"
                  onClick={() => onClickPercent(0.75)}
                />
                <PercentButton text="100%" onClick={() => onClickPercent(1)} />
              </Flex>
              <Flex w="100%" mt="1rem">
                <Slider
                  aria-label="slider-ex-1"
                  value={percentValue}
                  onChange={(v) => onChangeSlider(v)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
            </Flex>

            <Box mt="1.0rem" color="black">
              <Flex p="1rem" direction={['column', 'row']}>
                <Image boxSize="1.5rem" src={token0.icon} alt="Logo" />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {`Pooled ${token0.name}`}
                </Text>
                <Spacer />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {poolBalanceToken0
                    ? formatUnits(poolBalanceToken0, DECIMALS)
                    : '--'}
                </Text>
              </Flex>
              <Flex p="1rem" direction={['column', 'row']}>
                <Image boxSize="1.5rem" src={token1.icon} alt="Logo" />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {`Pooled ${token1.name}`}
                </Text>
                <Spacer />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {poolBalanceToken1
                    ? formatUnits(poolBalanceToken1, DECIMALS)
                    : '--'}
                </Text>
              </Flex>
            </Box>
            <Box mt="1.5rem">
              <Button
                size="lg"
                color={isConnected ? 'white' : 'blackAlpha.900'}
                bg={
                  isConnected ? theme.colors.pink_dark : theme.colors.gray_light
                }
                width="100%"
                p="1.62rem"
                borderRadius="1.25rem"
                _hover={{
                  bg: isConnected
                    ? theme.colors.pink_dark_hover
                    : theme.colors.gray_dark,
                }}
                isLoading={loading}
                loadingText="Removing"
                onClick={onRemoveLiquidity}
                isDisabled={!isConnected}
              >
                {isConnected
                  ? 'Remove'
                  : account
                  ? 'Please switch network'
                  : 'Please connect wallet'}
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
