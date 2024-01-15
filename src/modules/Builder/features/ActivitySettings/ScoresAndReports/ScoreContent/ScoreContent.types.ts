import { FieldValues, UseFormSetValue } from 'react-hook-form';

import { ItemFormValuesCommonType } from 'modules/Builder/types';
import {
  MultiSelectItem,
  ScoreConditionalLogic,
  ScoreOrSection,
  SingleSelectItem,
  SliderItem,
} from 'shared/state';
import { DataTableItem } from 'shared/components';

export type ScoreContentProps = {
  name: string;
  title: string;
  index: number;
  'data-testid'?: string;
  items: DataTableItem[];
  tableItems: DataTableItem[];
  scoreItems: ItemsWithScore[];
};

export type GetScoreRangeLabel = {
  minScore: number;
  maxScore: number;
};

export type ItemsWithScore =
  | SingleSelectItem<ItemFormValuesCommonType>
  | MultiSelectItem<ItemFormValuesCommonType>
  | SliderItem<ItemFormValuesCommonType>;

export type UpdateMessagesWithVariable = {
  setValue: UseFormSetValue<FieldValues>;
  reportsName: string;
  reports: ScoreOrSection[];
  oldScoreId: string;
  newScoreId: string;
  isScore?: boolean;
};

export type UpdateScoreConditionIds = {
  setValue: UseFormSetValue<FieldValues>;
  conditionsName: string;
  conditions: ScoreConditionalLogic[];
  scoreId: string;
};

export type UpdateMessage = {
  setValue: UseFormSetValue<FieldValues>;
  fieldName: string;
  id: string;
  newScoreId: string;
  showMessage: boolean;
  message?: string;
};
