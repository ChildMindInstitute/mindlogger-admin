import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ConditionalLogic } from 'shared/state/Applet';

import { getItemsInUsage } from './utils';

export const useItemsInUsage = (name: string) => {
  const { fieldName } = useCurrentActivity();
  const [itemKey, conditionalLogic]: [string, ConditionalLogic[]] = useWatch({
    name: [`${name}.itemKey`, `${fieldName}.conditionalLogic`],
  });
  const [itemsInUsage, setItemsInUsage] = useState(getItemsInUsage({ conditionalLogic, itemKey }));

  useEffect(() => {
    setItemsInUsage(getItemsInUsage({ conditionalLogic, itemKey }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionalLogic]);

  return itemsInUsage;
};
