// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { ItemResponseType } from 'shared/consts';
import { Item } from 'shared/state';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { useItemContent } from './Item.hooks';

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));
const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

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

describe('useItemContent', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParagraphTextItem: true,
      },
      resetLDContext: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render options for SingleSelection response type', () => {
    const { result } = renderHook(useItemContent);
    renderWithProviders(result.current(singleSelectionItem, mockSearch));

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

  test('should render titles for Text response type', () => {
    const textItem: Item = {
      responseType: ItemResponseType.Text,
    };
    const { result } = renderHook(useItemContent);
    renderWithProviders(result.current(textItem, ''));

    const itemTitle = screen.getByTestId('item-option-title');
    expect(itemTitle).toBeInTheDocument();
    expect(itemTitle).toHaveTextContent('Short Text');
  });

  test('should render titles for paragraphText response type', () => {
    const paragraphTextItem: Item = {
      responseType: ItemResponseType.ParagraphText,
    };
    const { result } = renderHook(useItemContent);
    renderWithProviders(result.current(paragraphTextItem, ''));

    const itemTitle = screen.getByTestId('item-option-title');
    expect(itemTitle).toBeInTheDocument();
    expect(itemTitle).toHaveTextContent('Paragraph Text');
  });
});
