import { createContext, useState } from 'react';

interface Props {
  children: any;
}

interface AppContextProps {
  account: string | undefined;
  setAccount: (account: string) => void;
}
const defautContext: AppContextProps = {
  account: undefined,
  setAccount: () => {},
};
const AppContext = createContext(defautContext);

export const AppProvider = function ({ children }: Props) {
  const [account, setAccount] = useState<string | undefined>();

  return (
    <AppContext.Provider value={{ account, setAccount }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
