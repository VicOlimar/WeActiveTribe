import React from 'react';
import { Helmet } from 'react-helmet';

type Props = {
  showSufix?: boolean,
  title: string,
}

const AppMeta = ({ showSufix = true, title } : Props) => {
  return (
    <Helmet>
      <title>{`${showSufix ? `${title} - We Active Tribe` : ''}`}</title>
      <meta property='title' content={title} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={''} />
      <meta property='og:description' content={''} />
      <meta property='fb:app_id' content='' />
    </Helmet>
  )
}

export default AppMeta;