import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';
import { page } from 'resources';
import { mockSuccessfulHttpResponse } from 'shared/utils/axios-mocks';

import { RemoveRespondentPopup } from '.';

const route = `/dashboard/${mockedAppletId}/respondents`;
const routePath = page.appletRespondents;
const chosenAppletData = {
  appletId: mockedAppletId,
  createdAt: '2025-01-01T00:00:00',
  respondentSecretId: '1231222',
  respondentId: '1231256',
  respondentNickname: 'respondentNickname',
  ownerId: '1',
  appletDisplayName: 'ApplletName',
  subjectId: mockedFullSubjectId1,
};

const onCloseMock = jest.fn();

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

describe('RemoveRespondentPopup component tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('RemoveRespondentPopup should open with applets list', async () => {
    renderWithProviders(<RemoveRespondentPopup {...{ ...commonProps, chosenAppletData: null }} />);

    await waitFor(() => {
      expect(
        screen.getByText('This Respondent has access to the following Applets:'),
      ).toBeInTheDocument();
      expect(screen.getByText(chosenAppletData.appletDisplayName)).toBeInTheDocument();
    });
  });

  test('RemoveRespondentPopup should remove access with appletId', async () => {
    mockAxios.post.mockResolvedValueOnce(mockSuccessfulHttpResponse(null));
    mockAxios.delete.mockResolvedValueOnce(mockSuccessfulHttpResponse(null));

    renderWithProviders(<RemoveRespondentPopup {...commonProps} />, {
      route,
      routePath,
    });

    fireEvent.click(screen.getAllByText('Remove from Applet')[1]);
    fireEvent.click(screen.getByText('Yes, Remove'));
    await waitFor(() => {
      expect(screen.getByText(chosenAppletData.appletDisplayName)).toBeInTheDocument();
      expect(screen.getByText(chosenAppletData.respondentSecretId)).toBeInTheDocument();
      expect(screen.getByText('Ok')).toBeInTheDocument();
    });
  });
});
