import React from 'react';
import { ThemeProvider } from 'react-jss';

import { IntlProviderWrapper } from './intl/IntlContext';
import themes from './theme';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  // TODO: allow the saved locale from the DB to override the system's settings
  const locale = navigator.language.split('-')[0] || 'en';  // eslint-disable-line no-undef

  // TODO: get the theme from the user's preferences
  const theme = 'dark';
  const activeTheme = themes[theme];

  return (
    <ThemeProvider theme={activeTheme}>
      <IntlProviderWrapper injectedLocale={locale}>
        <MainLayout />
      </IntlProviderWrapper>
    </ThemeProvider>
  );
};

export default App;
