import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'utils/renderComponentForEachTest';
import { SignUp } from './SignUp';

const submitForm = (username: string, password: string, firstName: string, lastName: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: firstName } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: lastName } });
  fireEvent.click(screen.getByTestId('submit-btn'));
};

const onSubmitMock = jest.fn();

describe('SignUp component tests', () => {
  renderComponentForEachTest(<SignUp onSubmitForTest={onSubmitMock} />);

  test('SignUp inputs should accept values', () => {
    inputAcceptsValue('Email', 'test@gmail.com');
    inputAcceptsValue('Password', 'password');
    inputAcceptsValue('First Name', 'fname');
    inputAcceptsValue('Last Name', 'lname');
  });

  test('should be able to disable submit button', () => {
    fireEvent.change(screen.getByLabelText(/I agree to the/i), { target: { value: false } });
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });

  test('should be able to validate SignUp form', () => {
    submitForm('test@gmail.com', 'password', 'fname', 'lname');
    waitFor(() =>
      expect(
        screen.getByText('Incorrect password for test@gmail.com if that user exists'),
      ).toBeInTheDocument(),
    );

    submitForm('test', 'password', 'fname', 'lname');
    waitFor(() => expect(screen.getByText('Incorrect Email')).toBeInTheDocument());

    submitForm('', '', '', '');
    waitFor(() => expect(screen.getByText('E-mail is required')).toBeInTheDocument());
    waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
    waitFor(() => expect(screen.getByText('First Name is required')).toBeInTheDocument());
    waitFor(() => expect(screen.getByText('Last Name is required')).toBeInTheDocument());
  });

  test('should be able to submit SignUp form', () => {
    submitForm('test@gmail.com', 'password', 'fname', 'lname');
    waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });
});
