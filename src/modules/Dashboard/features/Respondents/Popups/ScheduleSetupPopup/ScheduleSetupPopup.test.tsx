import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedAppletId,
  mockedOwnerId,
  mockedRespondentDetails,
  mockedRespondentId,
  mockedSubjectId1,
} from 'shared/mock';

import { ScheduleSetupPopup } from './ScheduleSetupPopup';

const setPopupVisibleMock = jest.fn();
const setChosenAppletDataMock = jest.fn();
const chosenAppletDataMock = {
  ...mockedRespondentDetails,
  respondentId: mockedRespondentId,
  ownerId: mockedOwnerId,
  subjectId: mockedSubjectId1,
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

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('ScheduleSetupPopup', () => {
  test('should render create individual schedule popup', async () => {
    mockAxios.post.mockResolvedValueOnce(null);
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
      'Respondent 3921968c-3903-4872-8f30-a6e6a10cef36 is a member of the Default Schedule within the Mocked Applet Applet. Do you want to set an Individual schedule for this Respondent?',
    );

    fireEvent.click(screen.getByText('Yes'));

    expect(mockAxios.post).toHaveBeenNthCalledWith(
      1,
      `/applets/${mockedAppletId}/events/individual/${mockedRespondentId}`,
      {},
      { signal: undefined },
    );
    await waitFor(() =>
      expect(mockedUseNavigate).toBeCalledWith(
        `/dashboard/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/schedule/${mockedRespondentId}`,
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
      `/dashboard/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/schedule/${mockedRespondentId}`,
    );
  });
});
