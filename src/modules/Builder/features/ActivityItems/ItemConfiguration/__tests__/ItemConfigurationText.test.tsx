// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import { mockedTestid, renderItemConfigurationByType, setItemConfigSetting } from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

const mockedTextTestid = `${mockedTestid}-text-response`;

const renderTextResponse = () => renderItemConfigurationByType(ItemResponseType.Text);

describe('ItemConfiguration: Text', () => {
  test('Is rendered correctly', () => {
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
    expect(description).toHaveTextContent('The respondent will be able to enter a text response.');

    expect(textInput).toBeDisabled();
    expect(textInput).toHaveValue('Text');
    expect(maxLength.querySelector('input')).toHaveValue(300);
  });

  test('Correct answer is required', async () => {
    renderTextResponse();

    await setItemConfigSetting(ItemConfigurationSettings.IsCorrectAnswerRequired);

    const answer = screen.getByTestId(`${mockedTextTestid}-correct-answer`);

    expect(answer).toBeVisible();
    expect(answer.querySelector('input')).toHaveValue('');
  });

  test('Correct answer is trimmed if MaxLength is changed', async () => {
    renderTextResponse();

    await setItemConfigSetting(ItemConfigurationSettings.IsCorrectAnswerRequired);

    fireEvent.change(
      screen.getByTestId(`${mockedTextTestid}-correct-answer`).querySelector('input'),
      {
        target: { value: 'correct' },
      },
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

  test('Validation: Max characters', async () => {
    renderTextResponse();

    fireEvent.change(screen.getByTestId(`${mockedTextTestid}-max-length`).querySelector('input'), {
      target: { value: 0 },
    });
    expect(await screen.findByText('A positive integer is required')).toBeVisible();
  });

  test('Validation: Correct answer required', async () => {
    const ref = renderTextResponse();

    await setItemConfigSetting(ItemConfigurationSettings.IsCorrectAnswerRequired);
    await ref.current.trigger('activities.0.items.0');

    expect(await screen.findByText('Correct Answer is required')).toBeVisible();
  });
});
