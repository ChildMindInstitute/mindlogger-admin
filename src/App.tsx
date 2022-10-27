import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from 'styles/theme';

function App() {
  const { t, i18n } = useTranslation('app');

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div>App Component</div>
        <div>
          <>{t('login')}</>
        </div>
        <div>
          <>{t('password')}</>
        </div>

        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('fr')}>FR</button>
      </div>
    </ThemeProvider>
  );
}

export default App;
