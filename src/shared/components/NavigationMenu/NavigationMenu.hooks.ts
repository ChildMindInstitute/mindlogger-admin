import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { applet, workspaces } from 'shared/state';

import { Item } from './NavigationMenu.types';
import { getActiveItem } from './NavigationMenu.utils';

export const useSettingsRedirection = (items: Item[]) => {
  const { setting } = useParams();
  const navigate = useNavigate();
  const isNewApplet = useCheckIfNewApplet();
  const appletLoadingStatus = applet.useResponseStatus();
  const rolesLoadingStatus = workspaces.useRolesResponseStatus();

  const activeItem = getActiveItem(items, setting);
  const isLoading = rolesLoadingStatus !== 'success' || (!isNewApplet && appletLoadingStatus !== 'success');

  useEffect(() => {
    if (!!setting && !isLoading && (!activeItem || activeItem?.disabled)) {
      navigate('.');
    }
  }, [activeItem, isLoading]);
};
