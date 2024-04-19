import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletId, mockedCurrentWorkspace, mockedRespondentId } from 'shared/mock';

import { RemoveIndividualSchedulePopup } from './RemoveIndividualSchedulePopup';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const route = `/dashboard/${mockedAppletId}/schedule/${mockedRespondentId}`;
const routePath = page.appletScheduleIndividual;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    workspacesRoles: initialStateData,
  },
};

const onCloseMock = jest.fn();
const setScheduleMock = jest.fn();
const setSelectedRespondentMock = jest.fn();

describe('RemoveIndividualSchedulePopup', () => {
  test('should render for isEmpty false', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    renderWithProviders(
      <RemoveIndividualSchedulePopup
        open={true}
        onClose={onCloseMock}
        name="Respondent Name"
        isEmpty={false}
        setSchedule={setScheduleMock}
        data-testid="remove-individual-schedule-popup"
        setSelectedRespondent={setSelectedRespondentMock}
      />,
      { route, routePath, preloadedState },
    );

    const popupText = screen.getByTestId('remove-individual-schedule-popup-text');
    expect(screen.getByTestId('remove-individual-schedule-popup')).toBeVisible();
    expect(popupText).toHaveTextContent(
      'You are about to remove Respondent Respondent Name’s individual schedule and move the Respondent to a group of Respondents that use the default schedule. All individually scheduled activities and their notifications will be lost. Are you sure you want to continue?',
    );

    fireEvent.click(screen.getByText('Remove'));

    expect(mockAxios.delete).toBeCalledWith(
      `/applets/${mockedAppletId}/events/remove_individual/${mockedRespondentId}`,
      { signal: undefined },
    );
    await waitFor(() =>
      expect(popupText).toHaveTextContent(
        'Respondent Respondent Name is now using the default schedule. You may add an individual schedule for this Respondent again any time.',
      ),
    );

    fireEvent.click(screen.getByText('Ok'));

    expect(setScheduleMock).toBeCalledWith('defaultSchedule');
    expect(setSelectedRespondentMock).toBeCalledWith(null);
    expect(mockedUseNavigate).toBeCalledWith(`/dashboard/${mockedAppletId}/schedule`);
    expect(onCloseMock).toBeCalled();
  });

  test('should render for isEmpty true', () => {
    renderWithProviders(
      <RemoveIndividualSchedulePopup
        open={true}
        onClose={onCloseMock}
        name="Respondent Name"
        isEmpty={true}
        setSchedule={setScheduleMock}
        data-testid="remove-individual-schedule-popup"
        setSelectedRespondent={setSelectedRespondentMock}
      />,
      { route, routePath, preloadedState },
    );

    const popupText = screen.getByTestId('remove-individual-schedule-popup-text');
    expect(popupText).toHaveTextContent(
      'Respondent Respondent Name’s individual schedule will be removed, and the Respondent will use the default schedule instead. Are you sure you want to continue?',
    );

    fireEvent.click(screen.getByText('Remove'));

    expect(popupText).toHaveTextContent(
      'Respondent Respondent Name is now using the default schedule. You may add an individual schedule for this Respondent again any time.',
    );

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
