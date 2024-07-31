// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ItemResponseType } from 'shared/consts';

import { handleSearchKeyDown, getIsOnlyMobileValue } from './GroupedSelectSearchController.utils';

describe('handleSearchKeyDown', () => {
  const stopPropagationMock = jest.fn();
  const preventDefaultMock = jest.fn();

  const mockEvent = {
    stopPropagation: stopPropagationMock,
    preventDefault: preventDefaultMock,
  };

  test('nothing is called if key is escape', () => {
    handleSearchKeyDown({ ...mockEvent, key: 'Escape' });

    expect(stopPropagationMock).not.toHaveBeenCalled();
    expect(preventDefaultMock).not.toHaveBeenCalled();
  });

  test('stops propagation if key is neither escape or enter', () => {
    handleSearchKeyDown({ ...mockEvent, key: 'Tab' });

    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).not.toHaveBeenCalled();
  });

  test('prevents default and stops propagation if key is enter', () => {
    handleSearchKeyDown({ ...mockEvent, key: 'Enter' });

    expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
  });
});

describe('getIsOnlyMobileValue', () => {
  test.each`
    value                                       | expectedResult
    ${ItemResponseType.SingleSelectionPerRow}   | ${false}
    ${ItemResponseType.MultipleSelectionPerRow} | ${false}
    ${ItemResponseType.SliderRows}              | ${false}
    ${ItemResponseType.Drawing}                 | ${true}
    ${ItemResponseType.Photo}                   | ${true}
    ${ItemResponseType.Video}                   | ${true}
    ${ItemResponseType.Geolocation}             | ${true}
    ${ItemResponseType.Audio}                   | ${true}
    ${ItemResponseType.SingleSelection}         | ${false}
    ${ItemResponseType.MultipleSelection}       | ${false}
    ${ItemResponseType.Slider}                  | ${false}
    ${ItemResponseType.Date}                    | ${false}
    ${ItemResponseType.Text}                    | ${false}
    ${ItemResponseType.ParagraphText}           | ${false}
  `('returns $expectedResult for value $value', ({ value, expectedResult }) => {
    const result = getIsOnlyMobileValue(value);
    expect(result).toBe(expectedResult);
  });
});
