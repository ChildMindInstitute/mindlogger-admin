import uniqueId from 'lodash.uniqueid';

import { ItemInputTypes } from 'shared/types/activityItems';
import { createArray } from 'shared/utils';

import { SelectionRows, SliderOption } from './ItemConfiguration.types';
import {
  DEFAULT_EMPTY_SLIDER,
  DEFAULT_EMPTY_SELECTION_ROWS_OPTION,
  DEFAULT_SELECTION_ROWS_SCORE,
  DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
} from './ItemConfiguration.const';

export const getEmptySliderOption = (): SliderOption => ({
  id: uniqueId('slider-'),
  ...DEFAULT_EMPTY_SLIDER,
});

export const getEmptySelectionItem = (scoresQuantity: number) => ({
  ...DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
  scores: createArray(scoresQuantity, () => DEFAULT_SELECTION_ROWS_SCORE),
});

export const getEmptySelectionRows = (type: SelectionRows['type']): SelectionRows => {
  const options = [DEFAULT_EMPTY_SELECTION_ROWS_OPTION];
  const scores = [DEFAULT_SELECTION_ROWS_SCORE];

  if (type === ItemInputTypes.SingleSelectionPerRow) {
    options.push(DEFAULT_EMPTY_SELECTION_ROWS_OPTION);
    scores.push(DEFAULT_SELECTION_ROWS_SCORE);
  }

  const result = {
    type,
    items: [{ label: '', tooltip: '', image: '', scores }],
    options,
  };

  return result;
};
