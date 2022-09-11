import { Button, Box, Text, Flex } from '@chakra-ui/react';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Identicon from './Identicon';
import theme from './../theme';
import { Goerli } from '@usedapp/core';
import { useContext, useEffect } from 'react';
import AppContext from './../AppContext';

type Props = {
  handleOpenModal: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const context = useContext(AppContext);
  const { activateBrowserWallet, chainId, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  useEffect(() => {
    account && context.setAccount(account); // set account to global context
  }, [account]);

  async function handleConnectWallet() {
    try {
      activateBrowserWallet();
    } catch (err) {
      console.log(err);
    }
  }

  return account ? (
    <Flex alignItems="center" bg="rgb(247, 248, 250)" borderRadius="xl" py="0">
      <Box>{`${chainId} - ${Goerli.chainId}`}</Box>
      <Box px="0.5rem">
        <Text color="black" fontSize="md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(0)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg={theme.colors.pink_light}
        border="0.06rem solid transparent"
        _hover={{
          border: '0.06rem',
          borderStyle: 'solid',
          borderColor: theme.colors.pink_light_hover,
        }}
        borderRadius="xl"
        m="0.06rem"
        px={3}
        h="2.37rem"
      >
        <Text color="black" fontSize="md" fontWeight="medium" mr="2">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
        <Identicon />
      </Button>
    </Flex>
  ) : (
    <Button
      onClick={handleConnectWallet}
      bg={theme.colors.pink_light}
      color={theme.colors.pink_dark}
      fontSize="1rem"
      fontWeight="semibold"
      borderRadius="xl"
      border="0.06rem solid rgb(253, 234, 241)"
      _hover={{
        borderColor: theme.colors.pink_dark,
      }}
      _active={{
        borderColor: theme.colors.pink_dark,
      }}
    >
      Connect to a wallet
    </Button>
  );
}
