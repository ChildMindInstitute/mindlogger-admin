import { waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Router from 'react-router';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RespondentsRemoveAccessPopup } from '.';

const appletId = '12313211';
const chosenAppletData = {
  appletId,
  respondentSecretId: '1231222',
  respondentId: '1231256',
  respondentNickname: 'respondentNickname',
  ownerId: '1',
  appletDisplayName: 'ApplletName',
};

const onCloseMock = jest.fn();
const fakeRequest = () => new Promise((res) => res(null));

const commonProps = {
  onClose: onCloseMock,
  popupVisible: true,
  chosenAppletData,
  tableRows: [
    {
      appletName: {
        content: () => <>{chosenAppletData.appletDisplayName}</>,
        value: chosenAppletData.appletDisplayName,
        onClick: onCloseMock,
      },
      secretUserId: {
        content: () => <>{chosenAppletData.respondentSecretId}</>,
        value: chosenAppletData.respondentSecretId,
        onClick: onCloseMock,
      },
      nickname: {
        content: () => <>{chosenAppletData.respondentNickname}</>,
        value: chosenAppletData.respondentNickname,
        onClick: onCloseMock,
      },
    },
  ],
};

describe('RespondentsRemoveAccessPopup component tests', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('RespondentsRemoveAccessPopup should open with applets list', async () => {
    renderWithProviders(
      <RespondentsRemoveAccessPopup {...{ ...commonProps, chosenAppletData: null }} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText('This Respondent has access to the following Applets:'),
      ).toBeInTheDocument();
      expect(screen.getByText(chosenAppletData.appletDisplayName)).toBeInTheDocument();
    });
  });

  test('RespondentsRemoveAccessPopup should remove access with appletId', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ appletId });
    jest.spyOn(mockedAxios, 'post').mockImplementation(fakeRequest);

    renderWithProviders(<RespondentsRemoveAccessPopup {...commonProps} />);

    fireEvent.click(screen.getAllByText('Remove Access')[1]);
    fireEvent.click(screen.getByText('Yes, Remove'));
    await waitFor(() => {
      expect(screen.getByText(chosenAppletData.appletDisplayName)).toBeInTheDocument();
      expect(screen.getByText(chosenAppletData.respondentSecretId)).toBeInTheDocument();
      expect(screen.getByText('Ok')).toBeInTheDocument();
    });
  });
});
