import { useParams } from 'react-router-dom';
import { isNewApplet } from 'shared/utils';

export const useCheckIfNewApplet = () => {
  const { appletId } = useParams();

  return isNewApplet(appletId);
};
