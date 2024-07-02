// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockedAlert, mockedSubjectId1 } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as useEncryptionStorageFunc from 'shared/hooks/useEncryptionStorage';

import { Notification } from './Notification';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Notification', () => {
  const mockedSetCurrentId = jest.fn();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should render component', () => {
    renderWithProviders(
      <Notification
        {...{
          ...mockedAlert,
          setCurrentId: mockedSetCurrentId,
        }}
      />,
    );

    expect(screen.getByText('applet#With_alerts')).toBeInTheDocument();
    expect(screen.getByText('secretId')).toBeInTheDocument();
    expect(screen.getByText(/SingleItem was matched with Opt1/)).toBeInTheDocument();
  });
  test('should render component when active', () => {
    renderWithProviders(
      <Notification
        {...{
          ...mockedAlert,
          currentId: mockedAlert.id,
          setCurrentId: mockedSetCurrentId,
        }}
      />,
    );

    expect(screen.getByText('applet#With_alerts')).toBeInTheDocument();
    expect(screen.getByText('secretId')).toBeInTheDocument();
    expect(screen.getByText(/SingleItem was matched with Opt1/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /takeMeToTheResponseData/i,
      }),
    ).toBeInTheDocument();
  });
  test('should clear current id when click on header of active notification', async () => {
    renderWithProviders(
      <Notification
        {...{
          ...mockedAlert,
          currentId: mockedAlert.id,
          setCurrentId: mockedSetCurrentId,
        }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: /takeMeToTheResponseData/i,
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`notification-${mockedAlert.id}`));
    expect(mockedSetCurrentId).toBeCalledWith('');
  });
  test('should navigate when click on response data button without existed encryption', async () => {
    const mockedgGetAppletPrivateKey = jest.fn().mockReturnValue('');
    jest
      .spyOn(useEncryptionStorageFunc, 'useEncryptionStorage')
      .mockReturnValue({ getAppletPrivateKey: mockedgGetAppletPrivateKey });

    renderWithProviders(
      <Notification
        {...{
          ...mockedAlert,
          currentId: mockedAlert.id,
          setCurrentId: mockedSetCurrentId,
        }}
      />,
    );

    const button = screen.getByRole('button', {
      name: /takeMeToTheResponseData/i,
    });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    expect(mockedUseNavigate).toBeCalledWith(
      `/dashboard/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/participants/${mockedSubjectId1}`,
    );
  });

  test('should navigate when click on response data button with existed encryption', async () => {
    const mockedgGetAppletPrivateKey = jest.fn().mockReturnValue('123');
    jest
      .spyOn(useEncryptionStorageFunc, 'useEncryptionStorage')
      .mockReturnValue({ getAppletPrivateKey: mockedgGetAppletPrivateKey });

    renderWithProviders(
      <Notification
        {...{
          ...mockedAlert,
          currentId: mockedAlert.id,
          setCurrentId: mockedSetCurrentId,
        }}
      />,
    );

    const button = screen.getByRole('button', {
      name: /takeMeToTheResponseData/i,
    });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    expect(mockedUseNavigate).toBeCalledWith(
      `/dashboard/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/participants/${mockedSubjectId1}`,
    );
  });
});
