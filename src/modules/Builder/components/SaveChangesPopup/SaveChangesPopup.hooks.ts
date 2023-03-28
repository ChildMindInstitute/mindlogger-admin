import { useLocation } from 'react-router-dom';

import { builderSessionStorage } from 'shared/utils/sessionStorage';
import { getLayer } from 'shared/hooks';

export const useSaveChangesPopupSetup = (handleSubmit: () => void) => {
  const { pathname } = useLocation();
  const layer = getLayer(pathname);

  const onSaveClick = () => {
    if (!layer) {
      handleSubmit();

      return;
    }

    const layerStorage = builderSessionStorage.getItem(layer) ?? {};
    builderSessionStorage.setItem(layer, layerStorage);
    handleSubmit();
  };

  const onDoNotSaveClick = () => {
    if (!layer) {
      handleSubmit();

      return;
    }

    builderSessionStorage.setItem(layer, {});
    handleSubmit();
  };

  return {
    onSaveClick,
    onDoNotSaveClick,
  };
};
