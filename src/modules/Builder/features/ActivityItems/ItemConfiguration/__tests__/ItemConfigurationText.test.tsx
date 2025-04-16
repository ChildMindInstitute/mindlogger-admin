// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { mockedTestid, renderItemConfigurationByType, setItemConfigSetting } from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

const mockedTextTestid = `${mockedTestid}-text-response`;
const mockedParagraphTextTestid = `${mockedTestid}-paragraph-text-response`;

const renderTextResponse = () => renderItemConfigurationByType(ItemResponseType.Text);
const renderParagraphTextResponse = () =>
  renderItemConfigurationByType(ItemResponseType.ParagraphText);
jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(),
}));
const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('ItemConfiguration: Short Text, ParagraphText', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParagraphTextItem: true,
      },
      resetLDContext: vi.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Short text Item is rendered correctly', () => {
    renderTextResponse();

    expect(screen.getByTestId(mockedTextTestid)).toBeVisible();

    const title = screen.getByTestId(`${mockedTextTestid}-title`);
    const description = screen.getByTestId(`${mockedTextTestid}-description`);
    const text = screen.getByTestId(`${mockedTextTestid}-input`);
    const textInput = text.querySelector('input');
    const maxLength = screen.getByTestId(`${mockedTextTestid}-max-length`);

    [title, description, text, maxLength].forEach((element) => {
      expect(element).toBeVisible();
    });

    expect(title).toHaveTextContent('Text Response');
    expect(description).toHaveTextContent(
      'The respondent will be able to enter a short text response',
    );

    expect(textInput).toBeDisabled();
    expect(textInput).toHaveValue('Text');
    expect(maxLength.querySelector('input')).toHaveValue(72);
  });

  test('Paragraph text Item is rendered correctly', () => {
    renderParagraphTextResponse();

    expect(screen.getByTestId(mockedParagraphTextTestid)).toBeVisible();

    const title = screen.getByTestId(`${mockedParagraphTextTestid}-title`);
    const description = screen.getByTestId(`${mockedParagraphTextTestid}-description`);
    const text = screen.getByTestId(`${mockedParagraphTextTestid}-input`);
    const textInput = text.querySelector('textarea');
    const maxLength = screen.getByTestId(`${mockedParagraphTextTestid}-max-length`);

    [title, description, text, maxLength].forEach((element) => {
      expect(element).toBeVisible();
    });

    expect(title).toHaveTextContent('Paragraph Text Response');
    expect(description).toHaveTextContent(
      'The respondent will be able to enter a long text response',
    );

    expect(textInput).toBeDisabled();
    expect(textInput).toHaveValue('Text');
    expect(maxLength.querySelector('input')).toHaveValue(1000);
  });

  test('Short text Item: correct answer is required', async () => {
    renderTextResponse();

    await setItemConfigSetting(ItemConfigurationSettings.IsCorrectAnswerRequired);

    const answer = screen.getByTestId(`${mockedTextTestid}-correct-answer`);

    expect(answer).toBeVisible();
    expect(answer.querySelector('input')).toHaveValue('');
  });

  test('Short text Item: correct answer is trimmed if MaxLength is changed', async () => {
    renderTextResponse();

    await setItemConfigSetting(ItemConfigurationSettings.IsCorrectAnswerRequired);

    fireEvent.change(
      screen.getByTestId(`${mockedTextTestid}-correct-answer`).querySelector('input'),
      { target: { value: 'correct' } },
    );
    fireEvent.change(screen.getByTestId(`${mockedTextTestid}-max-length`).querySelector('input'), {
      target: { value: 3 },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(`${mockedTextTestid}-correct-answer`).querySelector('input'),
      ).toHaveValue('cor');
    });
  });

  test('Short text Item: max characters validation', async () => {
    renderTextResponse();

    fireEvent.change(screen.getByTestId(`${mockedTextTestid}-max-length`).querySelector('input'), {
      target: { value: 0 },
    });
    expect(await screen.findByText('A positive integer is required')).toBeVisible();
  });

  test('Paragraph text Item: max characters validation', async () => {
    renderParagraphTextResponse();

    fireEvent.change(
      screen.getByTestId(`${mockedParagraphTextTestid}-max-length`).querySelector('input'),
      {
        target: { value: 0 },
      },
    );
    expect(await screen.findByText('A positive integer is required')).toBeVisible();
  });

  test('Short text Item: correct answer required validation', async () => {
    const ref = renderTextResponse();

    await setItemConfigSetting(ItemConfigurationSettings.IsCorrectAnswerRequired);
    await ref.current.trigger('activities.0.items.0');

    expect(await screen.findByText('Correct Answer is required')).toBeVisible();
  });
});
