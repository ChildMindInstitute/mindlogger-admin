import { BuilderLayers } from 'shared/hooks';

const getItemName = (layer: BuilderLayers) => `builder_${layer}_data`;
const setSpecificItem = (layer: BuilderLayers, data: Record<string, any>) => {
  const str = JSON.stringify(data);
  sessionStorage.setItem(getItemName(layer), str);
};
const getSpecificItem = (layer: BuilderLayers) => {
  try {
    const str = sessionStorage.getItem(getItemName(layer)) ?? '{}';

    return JSON.parse(str);
  } catch {
    return {};
  }
};

export const builderSessionStorage = {
  getItem: getSpecificItem,
  setItem: setSpecificItem,
};
