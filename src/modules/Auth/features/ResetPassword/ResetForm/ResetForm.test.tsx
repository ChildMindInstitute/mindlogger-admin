import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';
import { mockedEmail } from 'shared/mock';

import { ResetForm } from '.';

const submitForm = (email: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
  fireEvent.click(screen.getByTestId('reset-form-reset'));
};

describe('ResetForm component tests', () => {
  renderComponentForEachTest(<ResetForm />);

  test('ResetForm inputs should accept values', () => {
    inputAcceptsValue('Email', mockedEmail);
  });

  test('should be able to validate ResetForm form', async () => {
    submitForm('test');
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm('');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
  });
});
