import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation('app');

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
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
  );
}

export default App;
