import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'utils/renderComponentForEachTest';
import { Login } from './Login';

const submitForm = (username: string, password: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.click(screen.getByTestId('submit-btn'));
};

const onSubmitMock = jest.fn();

describe('Login component tests', () => {
  renderComponentForEachTest(<Login onSubmitForTest={onSubmitMock} />);

  test('login inputs should accept values', () => {
    inputAcceptsValue('Email', 'test@gmail.com');
    inputAcceptsValue('Password', 'password');
  });

  test('should be able to validate login form', () => {
    submitForm('test@gmail.com', 'password');
    waitFor(() =>
      expect(
        screen.getByText('Incorrect password for test@gmail.com if that user exists'),
      ).toBeInTheDocument(),
    );

    submitForm('test', 'password');
    waitFor(() => expect(screen.getByText('Incorrect Email')).toBeInTheDocument());

    submitForm('', '');
    waitFor(() => expect(screen.getByText('E-mail is required')).toBeInTheDocument());
    waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });

  test('should be able to submit login form', () => {
    submitForm('test@gmail.com', 'password');
    waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });
});
