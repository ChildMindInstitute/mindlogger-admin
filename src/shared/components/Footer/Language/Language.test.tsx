// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TFunction } from 'i18next';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { UiLanguages } from 'shared/ui';
import { storage } from 'shared/utils/storage';

import { Language } from './Language';

vi.mock('shared/utils/storage', () => ({
  storage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
  LocalStorageKeys: {
    Language: 'language',
  },
}));

vi.mock('react-i18next', () => ({
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
  beforeEach(() => {
    vi.mocked(storage.getItem).mockReturnValue(UiLanguages.EN);
    vi.clearAllMocks();
  });

  test('renders Language component with default language', () => {
    vi.mocked(storage.getItem).mockReturnValue(UiLanguages.EN);
    render(<Language />);
    const language = screen.getByText('English');
    expect(language).toBeInTheDocument();
  });

  test('select language popup should be closed by click cross', () => {
    vi.mocked(storage.getItem).mockReturnValue(UiLanguages.EN);
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
    vi.mocked(storage.getItem).mockReturnValue(UiLanguages.EN);
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
