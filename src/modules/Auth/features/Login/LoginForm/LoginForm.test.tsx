import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';

import { LoginForm } from '.';

const submitForm = (username: string, password: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.click(screen.getByTestId('submit-btn'));
};

describe('Login component tests', () => {
  renderComponentForEachTest(<LoginForm />);

  test('login inputs should accept values', () => {
    inputAcceptsValue('Email', 'test@gmail.com');
    inputAcceptsValue('Password', 'password');
  });

  test('should be able to validate login form', async () => {
    submitForm('test', 'password');
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm('test@gmail.com', '   password');
    await waitFor(() =>
      expect(screen.getByText('Password must not contain spaces.')).toBeInTheDocument(),
    );

    submitForm('', '');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });
});
