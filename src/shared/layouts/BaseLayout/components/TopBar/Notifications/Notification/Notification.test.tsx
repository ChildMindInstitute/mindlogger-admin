// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { mockedAlert, mockedFullSubjectId1 } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { Notification } from './Notification';

const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('Notification', () => {
  const mockedSetCurrentId = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
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
  test('should navigate to the answer associated with the alert when click on response data button', async () => {
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

    expect(mockedUseNavigate).toBeCalledWith({
      pathname: `/dashboard/${mockedAlert.appletId}/participants/${mockedFullSubjectId1}/activities/${mockedAlert.activityId}/responses`,
      search: `selectedDate=2023-08-03&answerId=${mockedAlert.answerId}`,
    });
  });
});
