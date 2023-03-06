import { Fragment } from 'react';
import Head from 'next/head';

const HtmlHead = () => (
  <Fragment>
    <Head>
      <title>Felida Music | Admin</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' sizes='32x32' href='/favicon.png' />
    </Head>
  </Fragment>
);

export default HtmlHead;
