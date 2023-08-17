import { Dispatch, SetStateAction } from 'react';

import { ConditionalLogic } from 'shared/state';
import { ItemFormValues } from 'modules/Builder/types';

export type SaveAndPublishProps = {
  hasPrompt: boolean;
  setIsFromLibrary: Dispatch<SetStateAction<boolean>>;
};

export type GetItemCommonFields = {
  id?: string;
  item: ItemFormValues;
  items: ItemFormValues[];
  conditionalLogic?: ConditionalLogic[];
};
