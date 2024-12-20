import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedFullParticipantId1 } from 'shared/mock';

import { ClearScheduledEventsPopup } from './ClearScheduledEventsPopup';

const dataTestid = 'clear-scheduled-events-popup';
const onCloseMock = jest.fn();
const basicProps = {
  open: true,
  onClose: onCloseMock,
  appletName: 'Displayed Applet Name',
  appletId: mockedAppletId,
  name: 'Displayed Respondent Name',
  'data-testid': dataTestid,
};

describe('ClearScheduledEventsPopup', () => {
  test('should delete events for default schedule', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);

    renderWithProviders(<ClearScheduledEventsPopup {...basicProps} />);

    const popupText = screen.getByTestId(`${dataTestid}-text`);
    expect(popupText).toHaveTextContent(
      'You are about to remove all scheduled events and notifications from the default schedule for Applet Displayed Applet Name. Are you sure you want to continue?',
    );

    fireEvent.click(screen.getByText('Clear All'));

    expect(
      expect(mockAxios.delete).nthCalledWith(1, `/applets/${mockedAppletId}/events`, {
        signal: undefined,
      }),
    );
    await waitFor(() => expect(screen.getByTestId('spinner')).toBeInTheDocument());
    await waitFor(() =>
      expect(popupText).toHaveTextContent(
        "Scheduled events within the default schedule for Applet Displayed Applet Name have been successfully cleared.Respondents' individual schedules (if applicable) have not changed.",
      ),
    );
  });

  test('should delete events for individual schedule', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    renderWithProviders(
      <ClearScheduledEventsPopup {...basicProps} userId={mockedFullParticipantId1} />,
    );

    const popupText = screen.getByTestId(`${dataTestid}-text`);
    expect(popupText).toHaveTextContent(
      'You are about to remove all scheduled events and notifications from the individual schedule for Respondent Displayed Respondent Name. Are you sure you want to continue?',
    );

    fireEvent.click(screen.getByText('Clear All'));

    expect(
      expect(mockAxios.delete).nthCalledWith(
        1,
        `/applets/${mockedAppletId}/events/delete_individual/${mockedFullParticipantId1}`,
        {
          signal: undefined,
        },
      ),
    );
    await waitFor(() => expect(screen.getByTestId('spinner')).toBeInTheDocument());
    await waitFor(() =>
      expect(popupText).toHaveTextContent(
        'Please note that Respondent Displayed Respondent Name is still using an individual schedule. You may revert this Respondent back to the default schedule by pressing the trash icon on the top-left.',
      ),
    );

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
