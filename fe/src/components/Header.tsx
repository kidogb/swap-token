import { ReactNode } from 'react';
import { Flex, Menu } from '@chakra-ui/react';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Menu>
      <Flex
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        maxW="99%"
        mx="auto"
        mt="1.5rem"
      >
        {children}
      </Flex>
    </Menu>
  );
}
