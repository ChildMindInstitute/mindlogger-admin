import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';

import { RemoveIndividualSchedulePopup } from './RemoveIndividualSchedulePopup';

const onCloseMock = jest.fn();
const dataTestid = 'remove-schedule-popup';

const commonProps = {
  'data-testid': dataTestid,
  appletId: mockedAppletId,
  onClose: onCloseMock,
  open: true,
  userId: mockedRespondentId,
  userName: 'John Doe',
};

describe('RemoveIndividualSchedulePopup', () => {
  describe('When `isEmpty` is true', () => {
    beforeEach(() => {
      renderWithProviders(<RemoveIndividualSchedulePopup {...commonProps} isEmpty />);
    });

    test('Renders the appropriate content', () => {
      const popupText = screen.getByTestId('remove-schedule-popup-text');
      expect(screen.getByTestId('remove-schedule-popup')).toBeVisible();
      expect(popupText).toHaveTextContent(
        `Respondent ${commonProps.userName}’s individual schedule will be removed, and the Respondent will use the default schedule instead. Are you sure you want to continue?`,
      );
    });

    test('Allows the user to cancel', () => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(onCloseMock).toBeCalled();
    });

    describe('When the user removes the individual schedule', () => {
      beforeEach(() => {
        mockAxios.delete.mockResolvedValueOnce(null);
      });

      test('Calls the appropriate endpoint', () => {
        fireEvent.click(screen.getByText('Remove'));

        expect(mockAxios.delete).toBeCalledWith(
          `/applets/${mockedAppletId}/events/remove_individual/${mockedRespondentId}`,
          { signal: undefined },
        );
      });

      test('Renders the appropriate content', async () => {
        fireEvent.click(screen.getByText('Remove'));

        await waitFor(() =>
          expect(screen.queryByTestId('remove-schedule-popup-text')).toHaveTextContent(
            `Respondent ${commonProps.userName} is now using the default schedule. You may add an individual schedule for this Respondent again any time.`,
          ),
        );

        fireEvent.click(screen.getByText('Ok'));

        expect(onCloseMock).toBeCalled();
      });
    });
  });

  describe('when `isEmpty` is false', () => {
    beforeEach(() => {
      renderWithProviders(<RemoveIndividualSchedulePopup {...commonProps} />);
    });

    test('Renders the appropriate content', () => {
      const popupText = screen.getByTestId('remove-schedule-popup-text');
      expect(screen.getByTestId('remove-schedule-popup')).toBeVisible();
      expect(popupText).toHaveTextContent(
        `You are about to remove Respondent ${commonProps.userName}’s individual schedule and move the Respondent to a group of Respondents that use the default schedule. All individually scheduled activities and their notifications will be lost. Are you sure you want to continue?`,
      );
    });

    test('Allows the user to cancel', () => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(onCloseMock).toBeCalled();
    });

    describe('When the user removes the individual schedule', () => {
      beforeEach(() => {
        mockAxios.delete.mockResolvedValueOnce(null);
      });

      test('Calls the appropriate endpoint', () => {
        fireEvent.click(screen.getByText('Remove'));

        expect(mockAxios.delete).toBeCalledWith(
          `/applets/${mockedAppletId}/events/remove_individual/${mockedRespondentId}`,
          { signal: undefined },
        );
      });

      test('Renders the appropriate content', async () => {
        fireEvent.click(screen.getByText('Remove'));

        await waitFor(() =>
          expect(screen.queryByTestId('remove-schedule-popup-text')).toHaveTextContent(
            `Respondent ${commonProps.userName} is now using the default schedule. You may add an individual schedule for this Respondent again any time.`,
          ),
        );

        fireEvent.click(screen.getByText('Ok'));

        expect(onCloseMock).toBeCalled();
      });
    });
  });
});
