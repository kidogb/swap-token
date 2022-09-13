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
  Flex,
  Link,
} from '@chakra-ui/react';
import theme from './theme';
import Header from './components/Header';
import ConnectButton from './components/ConnectButton';
import AccountModal from './components/Modal/AccountModal';
import Swap from './pages/Swap';
import Pool from './pages/Pool';
import '@fontsource/inter';
import './global.css';
import logo from './assets/uniswap_logo.svg';
import { AppProvider } from './AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UniMenu from './components/UniMenu';

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
        <UniMenu />
        <Flex>
          <Router>
            <Routes>
              <Route path="/swap" element={<Swap />}></Route>
              <Route path="/pool" element={<Pool />}></Route>
            </Routes>
          </Router>
        </Flex>
      </AppProvider>
    </ChakraProvider>
  );
}

export default App;
