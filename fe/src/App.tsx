import {
  ChakraProvider,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Center,
} from '@chakra-ui/react';
import theme from './theme';
import Header from './components/Header';
import ConnectButton from './components/ConnectButton';
import AccountModal from './components/Modal/AccountModal';
import Swap from './pages/Swap';
import '@fontsource/inter';
import './global.css';
import logo from './assets/uniswap_logo.svg';
import { AppProvider } from './AppContext';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <Header>
          <Image boxSize="5rem" src={logo} alt="Uniswap Logo" />
          <ConnectButton handleOpenModal={onOpen} />
          <AccountModal isOpen={isOpen} onClose={onClose} />
        </Header>

        <Center>
          <Tabs align="center" variant="soft-rounded" size="md">
            <TabList>
              <Tab>Swap</Tab>
              <Tab>Pool</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Swap />
              </TabPanel>
              <TabPanel>
                <Swap />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Center>
      </AppProvider>
    </ChakraProvider>
  );
}

export default App;
