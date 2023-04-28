import { useAppDispatch } from 'redux/store';
import { applet } from 'redux/modules';
import { builderSessionStorage } from 'shared/utils';

export const useRemoveAppletData = () => {
  const dispatch = useAppDispatch();

  return () => {
    builderSessionStorage.removeItem();
    dispatch(applet.actions.removeApplet());
  };
};
