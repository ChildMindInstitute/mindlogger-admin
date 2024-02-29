import { getSelectionSvgId, getSelectionPerRowSvgId } from './TooltipComponents.utils';

describe('getSelectionSvgId', () => {
  test.each([
    [1, true, 'radio-button-outline'],
    [2, true, 'radio-button-empty-outline'],
    [2, false, 'checkbox-empty-outline'],
    [3, false, 'checkbox-filled'],
  ])(
    'returns correct svg id for index %i and isSingleSelection %s',
    (index, isSingleSelection, expected) => {
      const result = getSelectionSvgId(index, isSingleSelection);
      expect(result).toEqual(expected);
    },
  );
});

describe('getSelectionPerRowSvgId', () => {
  test.each([
    [1, 1, true, 'radio-button-outline'],
    [2, 2, true, 'radio-button-outline'],
    [3, 3, true, 'radio-button-outline'],
    [1, 2, true, 'radio-button-empty-outline'],
    [2, 3, true, 'radio-button-empty-outline'],
    [3, 1, true, 'radio-button-empty-outline'],
    [1, 1, false, 'checkbox-filled'],
    [2, 1, false, 'checkbox-filled'],
    [2, 2, false, 'checkbox-filled'],
    [3, 1, false, 'checkbox-filled'],
    [2, 3, false, 'checkbox-empty-outline'],
    [3, 2, false, 'checkbox-empty-outline'],
  ])(
    'returns correct svg id for rowIndex %i, colIndex %i, and isSingleSelection %s',
    (rowIndex, colIndex, isSingleSelection, expected) => {
      const result = getSelectionPerRowSvgId(rowIndex, colIndex, isSingleSelection);
      expect(result).toEqual(expected);
    },
  );
});
