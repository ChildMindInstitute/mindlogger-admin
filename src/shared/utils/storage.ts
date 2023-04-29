import secureLocalStorage from 'react-secure-storage';

export const clearLocalStorageExceptSetupKeys = () => {
  const lang = secureLocalStorage.getItem('lang');
  secureLocalStorage.clear();
  secureLocalStorage.setItem('lang', lang as string);
};

export { secureLocalStorage as storage };
