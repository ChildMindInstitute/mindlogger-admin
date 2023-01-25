import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'utils/renderComponentForEachTest';

import { SignUpForm } from '.';

const submitForm = (email: string, password: string, firstName: string, lastName: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: firstName } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: lastName } });
  fireEvent.click(screen.getByTestId('submit-btn'));
};

describe('SignUp component tests', () => {
  renderComponentForEachTest(<SignUpForm />);

  test('SignUp inputs should accept values', () => {
    inputAcceptsValue('Email', 'test@gmail.com');
    inputAcceptsValue('Password', 'password');
    inputAcceptsValue('First Name', 'fname');
    inputAcceptsValue('Last Name', 'lname');
  });

  test('should be able to disable submit button', async () => {
    await fireEvent.click(screen.getByLabelText(/I agree to the/i));
    expect(screen.getByTestId('submit-btn')).toBeEnabled();
  });

  test('should be able to validate SignUp form', async () => {
    fireEvent.click(screen.getByLabelText(/I agree to the/i));
    submitForm('test', 'password', 'fname', 'lname');
    await waitFor(() => expect(screen.getByText('Incorrect Email')).toBeInTheDocument());

    submitForm('', '', '', '');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByText('First Name is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Last Name is required')).toBeInTheDocument());
  });
});
