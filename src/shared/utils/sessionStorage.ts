const ITEM_NAME = 'BUILDER_APPLET_DATA';

const setItem = (data: unknown) => {
  const str = JSON.stringify(data);
  sessionStorage.setItem(ITEM_NAME, str);
};
const getItem = () => {
  try {
    const str = sessionStorage.getItem(ITEM_NAME) || '';

    return JSON.parse(str);
  } catch {
    return;
  }
};
const removeItem = () => {
  sessionStorage.removeItem(ITEM_NAME);
};

export const builderSessionStorage = {
  getItem,
  setItem,
  removeItem,
};
