import { useParams } from 'react-router-dom';

import { isNewApplet } from 'shared/utils/urlGenerator';

export const useCheckIfNewApplet = () => {
  const { appletId } = useParams() || {};

  return isNewApplet(appletId);
};
