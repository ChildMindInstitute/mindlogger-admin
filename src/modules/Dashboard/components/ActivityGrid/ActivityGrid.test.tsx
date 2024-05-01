import { screen, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import ActivityGrid from 'modules/Dashboard/components/ActivityGrid/ActivityGrid';
import { TakeNowModalProps } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.types';
import { Row } from 'shared/components';
import { mockedAppletFormData } from 'shared/mock';

describe('ActivityGrid', () => {
  const mockTakeNowModalText = 'Mock Take Now Modal';
  const MockTakeNowModal = (_props: TakeNowModalProps) => <div>{mockTakeNowModalText}</div>;
  const dataTestId = 'test';

  test('Shows spinner when it is loading', async () => {
    renderWithProviders(
      <ActivityGrid
        isLoading={true}
        order={'desc'}
        orderBy={''}
        TakeNowModal={MockTakeNowModal}
        data-testid={dataTestId}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeInTheDocument();
      expect(screen.queryByText(mockTakeNowModalText)).toBeInTheDocument();
      expect(screen.queryByTestId(`${dataTestId}-grid`)).not.toBeInTheDocument();
    });
  });

  test('Shows no activities message when there are no activities', async () => {
    renderWithProviders(
      <ActivityGrid
        isLoading={false}
        order={'desc'}
        orderBy={''}
        TakeNowModal={MockTakeNowModal}
        data-testid={dataTestId}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('No activities found')).toBeInTheDocument();
      expect(screen.queryByText(mockTakeNowModalText)).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${dataTestId}-grid`)).not.toBeInTheDocument();
    });
  });

  test('Renders activities', async () => {
    const activity = mockedAppletFormData.activities[0];

    const rows: Row[] = [
      {
        image: {
          content: () => '',
          value: '',
        },
        name: {
          content: () => activity.name,
          value: activity.name,
        },
        participantCount: {
          content: () => null,
          value: Number(null),
        },
        latestActivity: {
          content: () => false,
          value: 'null',
        },
        compliance: {
          content: () => false,
          value: Number(null),
        },
        actions: {
          content: () => false,
          value: '',
        },
      },
    ];

    renderWithProviders(
      <ActivityGrid
        isLoading={false}
        rows={rows}
        order={'desc'}
        orderBy={''}
        TakeNowModal={MockTakeNowModal}
        data-testid={dataTestId}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText(mockTakeNowModalText)).toBeInTheDocument();
      expect(screen.queryByTestId(`${dataTestId}-grid`)).toBeInTheDocument();
      expect(screen.queryAllByTestId(`${dataTestId}-activity-card`)).toHaveLength(1);
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.queryByText('No activities found')).not.toBeInTheDocument();
    });
  });
});
