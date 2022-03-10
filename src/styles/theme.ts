import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: 'AACHENN, sans-serif',
    body: 'Lato, sans-serif',
  },
});
