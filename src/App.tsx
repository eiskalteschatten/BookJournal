import React from 'react';
import { ThemeProvider } from 'react-jss';
import { Provider } from 'react-redux';

import { IntlProviderWrapper } from './intl/IntlContext';
import themes from './theme';
import store from './store';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  // TODO: allow the saved locale from the DB to override the system's settings
  const locale = navigator.language.split('-')[0] || 'en';  // eslint-disable-line no-undef

  // TODO: get the theme from the user's preferences
  const theme = 'dark';
  const activeTheme = themes[theme];

  return (
    <Provider store={store}>
      <ThemeProvider theme={activeTheme}>
        <IntlProviderWrapper injectedLocale={locale}>
          <MainLayout />
        </IntlProviderWrapper>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
