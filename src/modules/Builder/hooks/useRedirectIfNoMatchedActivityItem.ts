import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { page } from 'resources';
import { useCheckIfNewApplet } from 'shared/hooks';
import { getEntityKey } from 'shared/utils';

import { useCurrentActivity } from './useCurrentActivity';
import { ItemFormValues } from '../types';
import { useCustomFormContext } from './useCustomFormContext';

export const useRedirectIfNoMatchedActivityItem = () => {
  const { appletId, activityId, itemId } = useParams();
  const navigate = useNavigate();
  const { fieldName } = useCurrentActivity();
  const isNewApplet = useCheckIfNewApplet();
  const { getValues } = useCustomFormContext();

  useEffect(() => {
    const items: ItemFormValues[] = getValues(`${fieldName}.items`);
    const item = items?.find(item => getEntityKey(item) === itemId);
    const shouldRedirect = (isNewApplet || items?.length > 0) && itemId && !item;

    if (!shouldRedirect) return;

    navigate(generatePath(page.builderAppletActivityItems, { appletId, activityId }));
  }, [itemId]);
};
