import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useCheckIfNewApplet } from 'shared/hooks';
import { applet } from 'shared/state';

import { Item } from './NavigationMenu.types';
import { getActiveItem } from './NavigationMenu.utils';

export const useSettingsRedirection = (items: Item[]) => {
  const { setting } = useParams();
  const navigate = useNavigate();
  const isNewApplet = useCheckIfNewApplet();
  const appletLoadingStatus = applet.useResponseStatus();
  const rolesLoadingStatus = applet.useResponseStatus();

  const activeItem = getActiveItem(items, setting);
  const isLoading =
    rolesLoadingStatus === 'loading' || (!isNewApplet && appletLoadingStatus === 'loading');

  useEffect(() => {
    if (!!setting && !isLoading && (!activeItem || activeItem?.disabled)) {
      navigate('.');
    }
  }, [activeItem, isLoading]);
};
