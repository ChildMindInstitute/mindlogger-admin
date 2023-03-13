import { fireEvent, screen } from '@testing-library/react';

import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';

import { Search } from './Search';

const onSearchMock = jest.fn();
const placeholder = 'Search';

describe('Search component tests', () => {
  renderComponentForEachTest(<Search onSearch={onSearchMock} placeholder={placeholder} />);

  test('Search input should accept values', () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    const value = 'test';

    fireEvent.change(input, { target: { value } });
    expect(input.value).toBe(value);
  });
});
