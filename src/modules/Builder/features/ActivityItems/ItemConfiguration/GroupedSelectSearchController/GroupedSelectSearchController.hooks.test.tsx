// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHook, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { useItemTypeSelectSetup } from './GroupedSelectSearchController.hooks';

describe('useItemTypeSelectSetup', () => {
  describe('getIsNotHaveSearchValue', () => {
    const { result } = renderHook(useItemTypeSelectSetup);
    const getIsNotHaveSearchValue = result.current.getIsNotHaveSearchValue;

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

  describe('getEmptyComponent', () => {
    const dataTestid = 'builder-activity-items-item-configuration-response-type-empty-search';
    const { result } = renderHook(useItemTypeSelectSetup);
    const getEmptyComponent = result.current.getEmptyComponent;

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
    const { result } = renderHook(useItemTypeSelectSetup);
    const getGroupName = result.current.getGroupName;

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
});
