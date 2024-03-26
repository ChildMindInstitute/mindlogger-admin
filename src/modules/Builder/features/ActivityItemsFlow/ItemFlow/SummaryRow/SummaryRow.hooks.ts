import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ConditionalLogic } from 'shared/state/Applet';

import { getItemsInUsage } from './SummaryRow.utils';

export const useItemsInUsage = (name: string) => {
  const { fieldName } = useCurrentActivity();
  const itemKey = useWatch({ name: `${name}.itemKey` });
  const conditionalLogic: ConditionalLogic[] = useWatch({ name: `${fieldName}.conditionalLogic` });
  const [itemsInUsage, setItemsInUsage] = useState(getItemsInUsage({ conditionalLogic, itemKey }));

  useEffect(() => {
    setItemsInUsage(getItemsInUsage({ conditionalLogic, itemKey }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionalLogic]);

  return itemsInUsage;
};
