import { ItemResponseType } from 'shared/consts';
import { ItemFormValues } from 'modules/Builder/types';
import { Condition, ConditionalLogic, ResponseValues } from 'shared/state/Applet';

export type ConditionWithResponseType = Condition & {
  responseType: ItemResponseType;
  responseValues: ResponseValues;
};

export type GetMatchOptionsProps = {
  items: ItemFormValues[];
  conditions: ConditionalLogic['conditions'];
};
