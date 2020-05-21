import React from 'react';

import { IntlProviderWrapper } from './intl/IntlContext';

const App: React.FC = () => {
  // TODO: allow the saved locale from the DB to override the system's settings
  const locale = navigator.language.split('-')[0] || 'en';  // eslint-disable-line no-undef

  return (
    <IntlProviderWrapper injectedLocale={locale}>

    </IntlProviderWrapper>
  );
};

export default App;
