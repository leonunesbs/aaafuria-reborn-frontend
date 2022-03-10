import { createContext } from 'react';
import { useColorModeValue } from '@chakra-ui/react';

interface ColorContextProps {
  green: string;
  bg: string;
}

interface ColorProviderProps {
  children: React.ReactNode;
}

export const ColorContext = createContext({} as ColorContextProps);

export function ColorProvider({ children }: ColorProviderProps) {
  const green = useColorModeValue('green.600', 'green.200');
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <ColorContext.Provider
      value={{
        green,
        bg,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}
