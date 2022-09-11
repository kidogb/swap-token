import { Button, Image } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import theme from '../theme';
type Props = {
  value: any;
  image: string;
  button: string;
};

export default function TokenSelect({
  value,
  image,
}: Props) {
  return value !== undefined ? (
    <Button
      bg="white"
      borderRadius="1.12rem"
      boxShadow="rgba(0, 0, 0, 0.075) 0px 6px 10px"
      fontWeight="500"
      mr="0.5rem"
      color="black"
      _hover={{ bg: theme.colors.gray_dark }}
      rightIcon={<ChevronDownIcon fontSize="1.37rem" cursor="pointer" />}
    >
      <Image boxSize="1.5rem" src={image} alt="Logo" mr="0.5rem" />
      {value} 
    </Button>
  ) : (
    <Button
      bg={theme.colors.pink_dark}
      color="white"
      p="0rem 1rem"
      borderRadius="1.12rem"
      _hover={{ bg: theme.colors.pink_dark_hover }}
      rightIcon={<ChevronDownIcon fontSize="1.37rem" cursor="pointer" />}
    >
      Select token
    </Button>
  );
}
