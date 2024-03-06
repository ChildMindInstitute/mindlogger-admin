import { FieldValues, UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import {
  MultiSelectItem,
  ScoreConditionalLogic,
  ScoreOrSection,
  SingleSelectItem,
  SliderItem,
} from 'shared/state';
import { ActivityFormValues, ItemFormValuesCommonType } from 'modules/Builder/types';
import { DataTableItem } from 'shared/components';
import { CalculationType } from 'shared/consts';

export type ScoreContentProps = {
  name: string;
  title: string;
  index: number;
  'data-testid'?: string;
  items: DataTableItem[];
  tableItems: DataTableItem[];
  scoreItems: ItemsWithScore[];
  isStaticActive: boolean;
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

export type GetScoreRange = {
  items: ItemsWithScore[];
  calculationType: CalculationType;
  activity?: ActivityFormValues;
};

export type GetIsScoreIdVariable = {
  id: string;
  reports: ScoreOrSection[];
  isScore: boolean;
};

export type IsMessageIncludeScoreId = { showMessage: boolean; id: string; message?: string };

export type UpdateScoreConditionsPayload = {
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  scoreConditionalsName: string;
  selectedItems: ItemsWithScore[];
  calculationType: CalculationType;
  activity?: ActivityFormValues;
};
