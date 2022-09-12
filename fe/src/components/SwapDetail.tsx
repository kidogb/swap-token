import { Flex, Box, Text, Spacer } from '@chakra-ui/react';

import theme from '../theme';
interface Props {
  slippage: string;
  currentAMountOut: string | undefined;
  expectedAmountOut: string | undefined;
}
function SwapDetail({ slippage, currentAMountOut, expectedAmountOut }: Props) {
  const amountOutAfterSlippage = expectedAmountOut
    ? (1 - parseFloat(slippage) / 100) * parseFloat(expectedAmountOut)
    : undefined;
  return (
    <Box p="0.5rem" bg="white" borderRadius="0 0 1.37rem 1.37rem">
      <Flex
        direction={['row', 'column']}
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        bg={theme.colors.gray_light}
        p="0.5rem"
        borderRadius="1.25rem"
        border="0.06rem solid rgb(237, 238, 242)"
        _hover={{ border: '0.06rem solid rgb(211,211,211)' }}
      >
        <Flex py="0.5rem" w="100%">
          <Text as="sub" size="md">
            Expected Output
          </Text>
          <Spacer />
          <Text as="sub" size="md">
            {expectedAmountOut
              ? Math.round(parseFloat(expectedAmountOut) * 1e16) / 1e16
              : '--'}
          </Text>
        </Flex>
        <Flex py="0.5rem" w="100%">
          <Box>
            <Text
              as="sub"
              size="md"
              color={theme.colors.gray_text}
            >{`Minimum received after slippage (${slippage}%)`}</Text>
          </Box>

          <Spacer />
          <Box>
            <Text as="sub" size="md" color={theme.colors.gray_text}>
              {amountOutAfterSlippage
                ? Math.round(amountOutAfterSlippage * 1e16) / 1e16
                : '--'}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default SwapDetail;
