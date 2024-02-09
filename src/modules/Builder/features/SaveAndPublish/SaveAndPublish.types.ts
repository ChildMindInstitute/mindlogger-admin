import {
  Condition,
  ConditionalLogic,
  ScoreReport,
  SectionCondition,
  SectionReport,
} from 'shared/state';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/types';

export type GetItemCommonFields = {
  id?: string;
  item: ItemFormValues;
  items: ItemFormValues[];
  conditionalLogic?: ConditionalLogic[];
};

export type GetSectionConditions = {
  items: ItemFormValues[];
  conditions?: SectionCondition[];
  scores?: ScoreReport[];
};

export type GetConditions = {
  items: ItemFormValues[];
  conditions?: (SectionCondition | Condition)[];
  score?: ScoreReport;
};

export type GetSection = {
  section: SectionReport;
  items: ActivityFormValues['items'];
  scores?: ScoreReport[];
  itemsObjectById: Record<string, ItemFormValues>;
};
