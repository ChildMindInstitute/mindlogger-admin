import { ItemFormValuesCommonType } from 'modules/Builder/types';
import { MultiSelectItem, SingleSelectItem, SliderItem } from 'shared/state';
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
