import { fireEvent, screen } from '@testing-library/react';

export const inputAcceptsValue = (label: string, value: string) => {
  const input = screen.getByLabelText(label) as HTMLInputElement;

  fireEvent.change(input, { target: { value } });

  expect(input.value).toBe(value);
};
