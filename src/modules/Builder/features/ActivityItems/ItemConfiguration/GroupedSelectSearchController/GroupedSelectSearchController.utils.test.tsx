// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import {
  handleSearchKeyDown,
  getIsNotHaveSearchValue,
  getEmptyComponent,
  getGroupName,
  getIsOnlyMobileValue,
} from './GroupedSelectSearchController.utils';

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

describe('getIsNotHaveSearchValue', () => {
  test.each`
    value                | searchTermLowercase  | expectedResult
    ${'SomeValue'}       | ${'somevalue'}       | ${false}
    ${'AnotherValue'}    | ${'somevalue'}       | ${true}
    ${'YetAnotherValue'} | ${''}                | ${false}
    ${'SingleSelection'} | ${'singleselection'} | ${false}
  `(
    'returns $expectedResult for value $value and searchTermLowercase $searchTermLowercase',
    ({ value, searchTermLowercase, expectedResult }) => {
      const result = getIsNotHaveSearchValue(value, searchTermLowercase);
      expect(result).toBe(expectedResult);
    },
  );
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

describe('getEmptyComponent', () => {
  const dataTestid = 'builder-activity-items-item-configuration-response-type-empty-search';

  test('returns null', () => {
    expect(getEmptyComponent('multi')).toBeNull();
  });

  test('returns empty component (MAX_SEARCH_VALUE_LENGTH < 80)', () => {
    const emptyComponent = getEmptyComponent('searchString') as JSX.Element;
    renderWithProviders(emptyComponent);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(
      screen.getByText(
        "No match was found for 'searchString'. Try a different search word or phrase.",
      ),
    ).toBeInTheDocument();
  });

  test('returns empty component (MAX_SEARCH_VALUE_LENGTH > 80)', () => {
    const searchValue =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const emptyComponent = getEmptyComponent(searchValue) as JSX.Element;
    renderWithProviders(emptyComponent);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(
      screen.getByText(
        "No match was found for 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i...'. Try a different search word or phrase.",
      ),
    ).toBeInTheDocument();
  });
});

describe('getGroupName', () => {
  const options = [
    {
      value: 'singleSelect',
      icon: <></>,
    },
    {
      value: 'slider',
      icon: <></>,
    },
  ];

  test('returns empty array', () => {
    const result = getGroupName('select', options, 'string');
    expect(result).toEqual([]);
  });

  test('returns group name component', () => {
    const componentWithGroupName = getGroupName('select', options, 'sing') as JSX.Element;
    renderWithProviders(componentWithGroupName);

    expect(
      screen.getByTestId('builder-activity-items-item-configuration-response-type-group-select'),
    ).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
  });
});
