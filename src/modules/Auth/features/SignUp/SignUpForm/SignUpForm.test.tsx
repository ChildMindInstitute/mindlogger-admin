import { fireEvent, waitFor, screen } from '@testing-library/react';

import { mockedEmail, mockedPassword } from 'shared/mock';
import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';

import { SignUpForm } from '.';

const submitForm = (email: string, password: string, firstName: string, lastName: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: firstName } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: lastName } });
  fireEvent.click(screen.getByTestId('signup-form-signup'));
};

describe('SignUp component tests', () => {
  renderComponentForEachTest(<SignUpForm />);

  test('SignUp inputs should accept values', () => {
    inputAcceptsValue('Email', mockedEmail);
    inputAcceptsValue('Password', mockedPassword);
    inputAcceptsValue('First Name', 'fname');
    inputAcceptsValue('Last Name', 'lname');
  });

  test('should be able to disable submit button', async () => {
    await fireEvent.click(screen.getByLabelText(/I agree to the/i));
    expect(screen.getByTestId('signup-form-signup')).toBeEnabled();
  });

  test('should be able to validate SignUp form', async () => {
    fireEvent.click(screen.getByLabelText(/I agree to the/i));
    submitForm('test', 'password', 'fname', 'lname');
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm(mockedEmail, ` ${mockedPassword}`, 'fname', 'lname');
    await waitFor(() => expect(screen.getByText('Password must not contain spaces.')).toBeInTheDocument());

    submitForm('', '', '', '');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('First name is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Last name is required')).toBeInTheDocument());
  });
});
