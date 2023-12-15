// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { Languages } from 'shared/api';

import { SelectLanguage } from './SelectLanguage';
import { languages } from '../Language.const';

const onClose = jest.fn();
const props = {
  open: true,
  onClose,
  currentLanguage: {
    value: Languages.EN,
  },
};

const dataTestid = 'select-language-popup';
const selectedAttribute = '[data-testid="select-language-popup-selected"]';

describe('SelectLanguage', () => {
  test('render SelectLanguage component with default language and change language to fr', async () => {
    renderWithProviders(<SelectLanguage {...props} />);

    expect(screen.getByText('Choose a language')).toBeInTheDocument();

    const languagePopup = screen.getByTestId(dataTestid);
    const paragraphElements = languagePopup.querySelectorAll('p');

    languages.forEach(({ label }) => {
      expect([...paragraphElements].some((element) => element.textContent === label)).toBe(true);
    });

    const en = screen.getByTestId(`${dataTestid}-en`);
    const fr = screen.getByTestId(`${dataTestid}-fr`);

    expect(en.querySelector(selectedAttribute)).toBeInTheDocument();
    expect(fr.querySelector(selectedAttribute)).not.toBeInTheDocument();

    fireEvent.click(fr);

    expect(en.querySelector(selectedAttribute)).not.toBeInTheDocument();
    expect(fr.querySelector(selectedAttribute)).toBeInTheDocument();
  });

  test('test close popup and "ok" button click', () => {
    renderWithProviders(<SelectLanguage {...props} />);

    const okButton = screen.getByText('Ok');
    fireEvent.click(okButton);

    expect(onClose).toBeCalledWith({
      value: Languages.EN,
    });

    const close = screen.getByTestId(`${dataTestid}-close-button`);
    fireEvent.click(close);
    expect(onClose).toBeCalledWith();
  });
});
