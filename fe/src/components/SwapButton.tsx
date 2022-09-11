import { Button, Box } from '@chakra-ui/react';
import theme from './../theme';

import { useEthers } from '@usedapp/core';

export default function SwapButton() {
  const { account } = useEthers();

  return account ? (
    window.__selected && window.__selected2 ? (
      <Box mt="0.5rem">
        <Button
          color="white"
          bg={theme.colors.pink_dark}
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: theme.colors.pink_dark_hover }}
        >
          Swap
        </Button>
      </Box>
    ) : (
      <Box mt="0.5rem">
        <Button
          color={theme.colors.pink_dark}
          bg={theme.colors.pink_light}
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: theme.colors.pink_light_hover }}
        >
          Select a token
        </Button>
      </Box>
    )
  ) : (
    <Box mt="0.5rem">
      <Button
        color={theme.colors.pink_dark}
        bg={theme.colors.pink_light}
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: theme.colors.pink_light_hover }}
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
