type SecureStorageValue = string | number | boolean | object;

const store = new Map<string, SecureStorageValue>();

// Replica of react-secure-storage: reads return straight away, and values keep the type they were
// written as. A stub that returns promises cannot stand in for that.
export const inMemorySecureStorage = {
  getItem: (key: string): SecureStorageValue | null => store.get(key) ?? null,

  setItem: (key: string, value: SecureStorageValue | null | undefined) => {
    if (value === null || value === undefined) {
      store.delete(key);

      return;
    }

    store.set(key, value);
  },

  removeItem: (key: string) => {
    store.delete(key);
  },

  clear: () => {
    store.clear();
  },
};

export const resetInMemorySecureStorage = () => store.clear();
