import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'utils/renderComponentForEachTest';
import { ResetForm } from '.';

const onSubmitMock = jest.fn();

const submitForm = (email: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
  fireEvent.click(screen.getByTestId('submit-btn'));
};

describe('ResetForm component tests', () => {
  renderComponentForEachTest(<ResetForm onSubmitForTest={onSubmitMock} />);

  test('ResetForm inputs should accept values', () => {
    inputAcceptsValue('Email', 'test@gmail.com');
  });

  test('should be able to validate ResetForm form', () => {
    submitForm('test');
    waitFor(() => expect(screen.getByText('Incorrect Email')).toBeInTheDocument());

    submitForm('');
    waitFor(() => expect(screen.getByText('E-mail is required')).toBeInTheDocument());
  });

  test('should be able to submit ResetForm form', () => {
    submitForm('test@gmail.com');
    waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });
});
