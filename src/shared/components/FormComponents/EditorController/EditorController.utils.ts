const SPECIAL_SYMBOLS_LENGTH = 4;

export const getValueLength = (value = '') => {
  const pattern = /^(\*\*).*(\*\*)$/;

  // logic when **___**
  if (pattern.test(value)) {
    return value.length - SPECIAL_SYMBOLS_LENGTH;
  }

  return value.length;
};
