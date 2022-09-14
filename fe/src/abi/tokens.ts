export interface Token {
  icon: string;
  name: string;
  address: string;
}

const tokens = [
  {
    icon: 'https://static.coinstats.app/coins/aaveZSi.png',
    name: 'AToken',
    address: '0x3388965802781fF73De53180A54Ac520ab996B55',
  },
  {
    icon: 'https://static.coinstats.app/coins/1650455588819.png',
    name: 'BToken',
    address: '0x81701263bA017a9D5F180b2e953d924F17640A54',
  },
  {
    icon: 'https://static.coinstats.app/coins/basic-attention-tokenbhU.png',
    name: 'XLP',
    address: '0x1A5797a73C23AFd1eFc816f4340147C7312d423C',
  },
];

export default tokens;
