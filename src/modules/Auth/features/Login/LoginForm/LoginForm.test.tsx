import { fireEvent, waitFor, screen } from '@testing-library/react';

import { mockedEmail, mockedPassword } from 'shared/mock';
import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';

import { LoginForm } from '.';

const submitForm = (username: string, password: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.click(screen.getByTestId('login-form-signin'));
};

describe('Login component tests', () => {
  renderComponentForEachTest(<LoginForm />);

  test('login inputs should accept values', () => {
    inputAcceptsValue('Email', mockedEmail);
    inputAcceptsValue('Password', mockedPassword);
  });

  test('should be able to validate login form', async () => {
    submitForm('test', mockedPassword);
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm(mockedEmail, ` ${mockedPassword}`);
    await waitFor(() => expect(screen.getByText('Password must not contain spaces.')).toBeInTheDocument());

    submitForm('', '');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });
});
