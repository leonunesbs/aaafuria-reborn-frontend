import { ThemeConfig, ThemeOverride, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
};

const themeOverride: ThemeOverride = {
  fonts: {
    heading: 'AACHENN, sans-serif',
    body: 'Lato, sans-serif',
  },
  styles: {
    global: {
      html: {
        overflow: 'hidden',
        height: '100%',
      },
      body: {
        overflow: 'auto',
        height: '100%',
        overscrollBehaviorY: 'none',
      },
    },
  },
};

export const theme: ThemeOverride = extendTheme({
  config,
  ...themeOverride,
});
