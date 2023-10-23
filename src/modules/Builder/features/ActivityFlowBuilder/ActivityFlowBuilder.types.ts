import { MouseEvent } from 'react';

import { ActivityFlowItem, AppletFormValues } from 'modules/Builder/types';

export enum GetMenuItemsType {
  AddActivity,
  ChangeActivity,
}

export type GetMenuItems = {
  type: GetMenuItemsType;
  index?: number;
  onMenuClose: () => void;
  activities: AppletFormValues['activities'];
  onAddFlowActivity?: (key: string) => void;
  onUpdateFlowActivity?: (index: number, object: ActivityFlowItem) => void;
};

export type GetFlowBuilderActions = {
  index: number;
  replaceItem: (event: MouseEvent<HTMLElement>, index: number, name: string) => void;
  duplicateItem: (index: number) => void;
  removeItem: () => void;
  replaceItemActionActive: boolean;
  'data-testid'?: string;
};
