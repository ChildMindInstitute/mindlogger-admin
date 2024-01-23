// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, fireEvent } from '@testing-library/react';

import { AlertsSchema } from 'redux/modules';
import { renderWithProviders } from 'shared/utils';

import { Notifications } from './Notifications';

const getAlertsPreloadedState = (data: AlertsSchema['alerts']['data'] = null) => ({
  alerts: {
    alerts: {
      data: {
        count: 0,
        notWatched: 0,
        result: [],
        ...data,
      },
    },
  },
});

describe('Notifications', () => {
  const mockedAlert = {
    id: 1,
    workspace: 'Test Test',
    appletId: 1,
    appletName: 'applet',
    image: null,
    secretId: 'secretId',
    message: 'message',
    timeAgo: '',
    isWatched: false,
    respondentId: '',
    encryption: {},
    alert: {},
    createdAt: '2023-03-27T12:00:00Z',
  };
  const intersectionObserverOriginal = global.IntersectionObserver;
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterAll(() => {
    global.IntersectionObserver = intersectionObserverOriginal;
  });

  test('should render component with empty list', () => {
    const preloadedState = getAlertsPreloadedState();
    const { container } = renderWithProviders(<Notifications />, {
      preloadedState,
    });

    expect(screen.getByText('No Alerts')).toBeInTheDocument();
    const svgElement = container.querySelector('.svg-navigate-up');
    expect(svgElement).toBeInTheDocument;
  });

  test('should render component with a read notification', () => {
    const preloadedState = getAlertsPreloadedState({
      count: 40,
      notWatched: 0,
      result: [mockedAlert],
    });
    const { container } = renderWithProviders(<Notifications />, {
      preloadedState,
    });

    expect(screen.getByText('applet')).toBeInTheDocument();
    expect(screen.getByText('secretId')).toBeInTheDocument();
    expect(screen.getByText('message')).toBeInTheDocument();
    expect(screen.getByText('10 months ago')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /collapse-expand/i,
      }),
    );

    expect(container.querySelector('.svg-navigate-up')).not.toBeInTheDocument;
    expect(container.querySelector('.svg-navigate-down')).toBeInTheDocument;
    expect(screen.queryByText('applet')).not.toBeInTheDocument();
    expect(screen.queryByText('secretId')).not.toBeInTheDocument();
    expect(screen.queryByText('message')).not.toBeInTheDocument();
    expect(screen.queryByText('10 months ago')).not.toBeInTheDocument();
  });

  test('should render component with a unread notification', () => {
    const preloadedState = getAlertsPreloadedState({
      count: 40,
      notWatched: 1,
      result: [
        {
          ...mockedAlert,
          isWatched: false,
        },
      ],
    });
    renderWithProviders(<Notifications />, {
      preloadedState,
    });

    expect(screen.getByText('1 Unread')).toBeInTheDocument();
  });
});
