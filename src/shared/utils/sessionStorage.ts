import { BuilderLayers } from 'shared/hooks';

const getItemName = (item: BuilderLayers) => `builder_${item}_data`;
const setSpecificItem = (item: BuilderLayers, data: /*boolean | */ unknown) => {
  const str = JSON.stringify(data);
  sessionStorage.setItem(getItemName(item), str);
};
const getSpecificItem = (item: BuilderLayers) => {
  try {
    const str = sessionStorage.getItem(getItemName(item)) ?? '{}';

    return JSON.parse(str);
  } catch {
    return {};
  }
};

export const builderSessionStorage = {
  getItem: getSpecificItem,
  setItem: setSpecificItem,
};
