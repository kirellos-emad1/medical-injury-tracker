import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          href="https://home.lief.care/wp-content/uploads/2023/07/cropped-lief-siteiconn-32x32.png"
          sizes="32x32"
        ></link>
        <link
          rel="icon"
          href="https://home.lief.care/wp-content/uploads/2023/07/cropped-lief-siteiconn-192x192.png"
          sizes="192x192"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
