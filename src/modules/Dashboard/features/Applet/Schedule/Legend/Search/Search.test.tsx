// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { Search } from './Search';

describe('Search component', () => {
  test('displays input and handles empty selectedRespondent correctly', () => {
    renderWithProviders(<Search placeholder="Search here" selectedRespondent={null} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('');
  });

  test('displays value based on selectedRespondent correctly', () => {
    const selectedRespondent = {
      id: '1',
      nickname: 'janedoe',
      secretId: 'abc123',
    };
    renderWithProviders(<Search placeholder="Search" selectedRespondent={selectedRespondent} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement.value).toBe('abc123 (janedoe)');
  });
});
