import secureLocalStorage from 'react-secure-storage';

class SecureLocalStorage {
  setItem(key: string, value: string | object | number | boolean) {
    secureLocalStorage.setItem(key, value);
  }

  getItem(key: string): string | object | number | boolean | null {
    return secureLocalStorage.getItem(key);
  }

  removeItem(key: string): void {
    secureLocalStorage.removeItem(key);
  }

  clear(shouldKeepSetupKeys = false): void {
    // Preserve necessary keys
    if (!shouldKeepSetupKeys) {
      secureLocalStorage.clear();

      return;
    }

    const lang = secureLocalStorage.getItem('lang');
    secureLocalStorage.clear();
    secureLocalStorage.setItem('lang', lang as string);
  }
}

/**
 * Create an instance of secureLocalStorage
 */
const secureMLLocalStorage = new SecureLocalStorage();

export { secureMLLocalStorage as storage };
