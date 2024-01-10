import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { mockedRespondentDetails, mockedRespondentId, mockedOwnerId } from 'shared/mock';

import * as hooks from '../Popup.hooks';

import { ViewDataPopup } from './ViewDataPopup';

const setChosenAppletDataMock = jest.fn();
const setPopupVisibleMock = jest.fn();
const chosenAppletDataMock = {
  ...mockedRespondentDetails,
  respondentId: mockedRespondentId,
  ownerId: mockedOwnerId,
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

const useCheckIfHasEncryptionMock = jest.spyOn(hooks, 'useCheckIfHasEncryption');

describe('ViewDataPopup', () => {
  test('should render enter password popup', async () => {
    useCheckIfHasEncryptionMock.mockReturnValueOnce(false);
    renderWithProviders(
      <ViewDataPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        tableRows={tableRowsMock}
        chosenAppletData={chosenAppletDataMock}
        setChosenAppletData={setChosenAppletDataMock}
      />,
    );

    const popup = screen.getByTestId('dashboard-respondents-view-data-popup');
    expect(popup).toBeInTheDocument();
    expect(
      screen.getByTestId('dashboard-respondents-view-data-popup-enter-password-password'),
    ).toBeInTheDocument();
  });

  test('should render table with applets', () => {
    useCheckIfHasEncryptionMock.mockReturnValueOnce(true);
    renderWithProviders(
      <ViewDataPopup
        popupVisible={true}
        setPopupVisible={setPopupVisibleMock}
        tableRows={tableRowsMock}
        chosenAppletData={chosenAppletDataMock}
        setChosenAppletData={setChosenAppletDataMock}
      />,
    );

    expect(
      screen.getByText('Please select the Applet to view Respondent\'s data for:'),
    ).toBeInTheDocument();

    const tableRow = screen.getByText('Mocked Applet');
    fireEvent.click(tableRow);

    expect(setChosenAppletDataMock).toBeCalledWith(chosenAppletDataMock);
  });
});
