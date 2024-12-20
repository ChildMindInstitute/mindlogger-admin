import { fireEvent } from '@testing-library/react';
import { generatePath, useNavigate } from 'react-router-dom';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedFullParticipantId1,
  mockedOwnerId,
  mockedFullSubjectId1,
  mockedAppletId,
  mockedFullParticipant1,
} from 'shared/mock';
import { page } from 'resources';

import { ViewParticipantPopup } from './ViewParticipantPopup';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  generatePath: jest.fn(),
}));

const mockedUseNavigate = jest.mocked(useNavigate);
const mockedGeneratePath = jest.mocked(generatePath);

const setChosenAppletDataMock = jest.fn();
const setPopupVisibleMock = jest.fn();
const chosenAppletDataMock = {
  ...mockedFullParticipant1.details[0],
  respondentId: mockedFullParticipantId1,
  ownerId: mockedOwnerId,
  subjectId: mockedFullSubjectId1,
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

describe('ViewParticipantPopup', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    mockedUseNavigate.mockReturnValue(navigateMock);
  });

  test('should render table with applets', () => {
    const { getByText } = renderWithProviders(
      <ViewParticipantPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        tableRows={tableRowsMock}
        chosenAppletData={null}
        setChosenAppletData={setChosenAppletDataMock}
      />,
    );

    expect(
      getByText("Please select the Applet to view Respondent's data for:"),
    ).toBeInTheDocument();

    const tableRow = getByText('Mocked Applet');
    fireEvent.click(tableRow);

    expect(setChosenAppletDataMock).toBeCalledWith(chosenAppletDataMock);
  });

  test('should navigate to the participant detail page', () => {
    renderWithProviders(
      <ViewParticipantPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        tableRows={tableRowsMock}
        chosenAppletData={chosenAppletDataMock}
        setChosenAppletData={setChosenAppletDataMock}
      />,
    );

    expect(mockedGeneratePath).toBeCalledWith(page.appletParticipantDetails, {
      appletId: mockedAppletId,
      subjectId: mockedFullSubjectId1,
    });
    expect(navigateMock).toBeCalledTimes(1);
  });
});
