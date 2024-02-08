import { fireEvent, waitFor, screen, act } from '@testing-library/react';

import { mockedAppletId, mockedEncryption, mockedPassword } from 'shared/mock';
import { renderWithProviders } from 'shared/utils';

import { AppletPasswordPopup } from './AppletPasswordPopup';
import { AppletPasswordPopupProps, AppletPasswordPopupType } from './AppletPasswordPopup.types';

const mockCloseFn = jest.fn();
const mockedDataTestId = 'mockedDataTestId';

const getPopup = (props: Partial<AppletPasswordPopupProps> = {}) => (
  <AppletPasswordPopup
    popupVisible={true}
    onClose={mockCloseFn}
    encryption={mockedEncryption}
    data-testid={mockedDataTestId}
    appletId={mockedAppletId}
    {...props}
  />
);

describe('AppletPasswordPopup component tests', () => {
  test('should render popup with default values', () => {
    renderWithProviders(getPopup());

    expect(screen.getByTestId(mockedDataTestId)).toBeInTheDocument();
    expect(screen.getByText('Enter Applet Password')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('mockedDataTestId-close-button'));

    expect(mockCloseFn).toBeCalled();
  });

  test('should render create applet password', async () => {
    renderWithProviders(getPopup({ popupType: AppletPasswordPopupType.Create }));

    const submitButton = screen.getByText('Submit');
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: mockedPassword } });
    fireEvent.change(screen.getByLabelText('Repeat the password'), {
      target: { value: mockedPassword },
    });
    act(() => fireEvent.click(submitButton));

    await waitFor(() => expect(mockCloseFn).toBeCalled());
  });

  test('should show spinner', () => {
    renderWithProviders(getPopup({ isLoading: true }));

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
