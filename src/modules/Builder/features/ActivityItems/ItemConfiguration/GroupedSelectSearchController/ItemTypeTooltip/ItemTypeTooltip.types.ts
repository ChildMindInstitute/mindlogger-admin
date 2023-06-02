// import { ItemResponseType } from 'shared/consts';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

export type ItemTypeTooltipProps = {
  // uiType: ItemResponseType;
  uiType: ItemResponseTypeNoPerfTasks;
  anchorEl: HTMLLIElement | null;
};
