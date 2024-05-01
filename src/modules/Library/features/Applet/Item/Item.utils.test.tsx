// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { ItemResponseType } from 'shared/consts';
import { Item } from 'shared/state';

import { getSelector, renderItemContent } from './Item.utils';

const singleSelectionItem: Item = {
  responseType: ItemResponseType.SingleSelection,
  responseValues: {
    options: [
      { text: 'Option 1', image: 'https://example.com/image1.png' },
      { text: 'Option 2', image: 'https://example.com/image2.png' },
    ],
  },
};

const mockSearch = 'option 1';

describe('renderItemContent', () => {
  test('should render options for SingleSelection response type', () => {
    renderWithProviders(renderItemContent(singleSelectionItem, mockSearch));

    const highlightedText = screen.getByText(new RegExp(`^${mockSearch}$`, 'i'));
    const parentElement = highlightedText.closest('.highlighted-text');

    expect(highlightedText).toBeInTheDocument();
    expect(parentElement).toHaveClass('highlighted-text'); // search matches should be wrapped in highlighted-text class

    const options = screen.getAllByTestId(/^item-option-\d+$/);
    expect(options).toHaveLength(2);

    options.forEach((option, index) => {
      const textContent = option.textContent;
      expect(textContent).toEqual(singleSelectionItem.responseValues.options[index].text);

      const img = option.querySelector('img');
      expect(img).toBeInTheDocument();

      const imgSrc = img.getAttribute('src');
      const expectedSrc = singleSelectionItem.responseValues.options[index].image;
      expect(imgSrc).toEqual(expectedSrc);
    });
  });

  test('should render titles for other response types', () => {
    const textItem: Item = {
      responseType: ItemResponseType.Text,
    };

    renderWithProviders(renderItemContent(textItem, ''));

    const itemTitle = screen.getByTestId('item-option-title');
    expect(itemTitle).toBeInTheDocument();
    expect(itemTitle).toHaveTextContent('Text');
  });
});

describe('getSelector', () => {
  test.each`
    value1             | value2    | expected
    ${'abc'}           | ${'123'}  | ${'abc-123'}
    ${''}              | ${'xyz'}  | ${'-xyz'}
    ${'special-chars'} | ${'@!#%'} | ${'special-chars-@!#%'}
  `('should concatenate $value1 and $value2 to get $expected', ({ value1, value2, expected }) => {
    const result = getSelector(value1, value2);

    expect(result).toBe(expected);
  });
});
