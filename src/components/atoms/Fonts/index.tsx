import { Global } from '@emotion/react';

export const Fonts = () => {
  return (
    <Global
      styles={`
      /* heading */
      /* latin */
      @font-face {
        font-family: 'AACHENN';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/AACHENN.ttf') format('truetype');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* body */
      /* latin */
      @font-face {
        font-family: 'Lato';
        font-style: thin;
        font-weight: 100;
        font-display: swap;
        src: url('./fonts/Lato-Thin.ttf') format('truetype');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Lato';
        font-style: light;
        font-weight: 300;
        font-display: swap;
        src: url('./fonts/Lato-Light.ttf') format('truetype');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Lato';
        font-style: regular;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/Lato-Regular.ttf') format('truetype');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Lato';
        font-style: bold;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/Lato-Bold.ttf') format('truetype');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Lato';
        font-style: extra-bold;
        font-weight: 900;
        font-display: swap;
        src: url('./fonts/Lato-Black.ttf') format('truetype');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      `}
    />
  );
};
