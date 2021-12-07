/* eslint-disable @next/next/no-title-in-document-head */
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class Document extends NextDocument {
  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-256x256.png"></link>
          <meta name="theme-color" content="#2F855A" />
          <link rel="shortcut icon" href="/icon-192x192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
