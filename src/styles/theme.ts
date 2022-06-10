import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  disableTransitionOnChange: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: 'AACHENN, sans-serif',
    body: 'Lato, sans-serif',
  },
  styles: {
    global: {
      html: {
        height: '100%',
        scrollBehavior: 'smooth',
      },
      body: {
        height: '100%',
      },
    },
  },
});
