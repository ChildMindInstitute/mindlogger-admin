import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'utils/renderComponentForEachTest';

import { ResetForm } from '.';

const submitForm = (email: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
  fireEvent.click(screen.getByTestId('submit-btn'));
};

describe('ResetForm component tests', () => {
  renderComponentForEachTest(<ResetForm />);

  test('ResetForm inputs should accept values', () => {
    inputAcceptsValue('Email', 'test@gmail.com');
  });

  test('should be able to validate ResetForm form', async () => {
    submitForm('test');
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm('');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
  });
});
