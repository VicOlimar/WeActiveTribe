import React from 'react';
import { Helmet } from 'react-helmet';

type Props = {
  showPrefix?: boolean,
  title: string,
}

const AppMeta = ({ showPrefix = true, title } : Props) => {
  return (
    <Helmet>
      <title>{`${showPrefix ? 'We Cycling - ' : ''}`}{title}</title>
      <meta property='title' content={title} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={''} />
      <meta property='og:description' content={''} />
      <meta property='fb:app_id' content='' />
    </Helmet>
  )
}

export default AppMeta;