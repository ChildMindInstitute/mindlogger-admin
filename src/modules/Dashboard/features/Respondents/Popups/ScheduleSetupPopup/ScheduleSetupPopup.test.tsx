import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedAppletId,
  mockedOwnerId,
  mockedFullParticipantId1,
  mockedFullSubjectId1,
  mockedFullParticipant1,
} from 'shared/mock';

import { ScheduleSetupPopup } from './ScheduleSetupPopup';

const setPopupVisibleMock = vi.fn();
const setChosenAppletDataMock = vi.fn();
const chosenAppletDataMock = {
  ...mockedFullParticipant1.details[0],
  respondentId: mockedFullParticipantId1,
  ownerId: mockedOwnerId,
  subjectId: mockedFullSubjectId1,
  createdAt: mockedFullParticipant1.details[0].subjectCreatedAt,
};

const tableRowsMock = [
  {
    appletName: {
      value: 'Mocked Applet',
      content: () => 'Mocked Applet',
      onClick: () => setChosenAppletDataMock(chosenAppletDataMock),
    },
    secretUserId: {
      value: 'mockedSecretId',
      content: () => 'mockedSecretId',
      onClick: () => setChosenAppletDataMock(chosenAppletDataMock),
    },
    nickname: {
      value: 'Mocked Respondent',
      content: () => 'Mocked Respondent',
      onClick: () => setChosenAppletDataMock(chosenAppletDataMock),
    },
  },
];

const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('ScheduleSetupPopup', () => {
  test('should render create individual schedule popup', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce(null);
    renderWithProviders(
      <ScheduleSetupPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        tableRows={tableRowsMock}
        chosenAppletData={chosenAppletDataMock}
        setChosenAppletData={setChosenAppletDataMock}
      />,
    );

    const popup = screen.getByTestId('dashboard-respondents-view-calendar-popup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent(
      'Respondent mockedSecretId is a member of the Default Schedule within the Mocked Applet Applet. Do you want to set an Individual schedule for this Respondent?',
    );

    fireEvent.click(screen.getByText('Yes'));

    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      `/applets/${mockedAppletId}/events/individual/${mockedFullParticipantId1}`,
      {},
      { signal: undefined },
    );
    await waitFor(() =>
      expect(mockedUseNavigate).toBeCalledWith(
        `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/schedule`,
      ),
    );
  });
  test('should render table of applets', () => {
    renderWithProviders(
      <ScheduleSetupPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        tableRows={tableRowsMock}
        chosenAppletData={{ ...chosenAppletDataMock, hasIndividualSchedule: true }}
        setChosenAppletData={setChosenAppletDataMock}
      />,
    );

    expect(
      screen.getByText('Please select Applet to schedule for the Respondent:'),
    ).toBeInTheDocument();
    const tableRow = screen.getByText('Mocked Applet');
    fireEvent.click(tableRow);

    expect(setChosenAppletDataMock).toBeCalledWith(chosenAppletDataMock);
    expect(mockedUseNavigate).toBeCalledWith(
      `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/schedule`,
    );
  });
});
