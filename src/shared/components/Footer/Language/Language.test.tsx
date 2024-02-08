// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import { TFunction } from 'i18next';

import { Language } from './Language';

jest.mock('react-i18next', () => ({
  useTranslation: (): { t: TFunction; i18n: { changeLanguage: () => Promise<unknown> } } => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

const dataTestid = 'select-language-popup';

describe('Language', () => {
  test('renders Language component with default language', () => {
    render(<Language />);
    const language = screen.getByText('English');
    expect(language).toBeInTheDocument();
  });

  test('select language popup should be closed by click cross', () => {
    render(<Language />);
    const language = screen.getByText('English');
    expect(language).toBeInTheDocument();

    fireEvent.click(language);
    expect(screen.queryByTestId(dataTestid)).toBeInTheDocument();
    const closePopupButton = screen.queryByTestId(`${dataTestid}-close-button`);

    fireEvent.click(closePopupButton);
    expect(screen.queryByTestId(dataTestid)).not.toBeInTheDocument();
  });

  test('interface language should be changed', () => {
    render(<Language />);
    const language = screen.getByText('English');
    fireEvent.click(language);
    expect(screen.queryByTestId(dataTestid)).toBeInTheDocument();

    const french = screen.getByText('Français');
    fireEvent.click(french);

    const okButton = screen.getByText('ok');
    fireEvent.click(okButton);

    expect(screen.queryByTestId(dataTestid)).not.toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });
});
