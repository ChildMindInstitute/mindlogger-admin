import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { expectBanner } from 'shared/utils';
import * as MixpanelFunc from 'shared/utils/mixpanel';

import { AddParticipantPopup } from './AddParticipantPopup';

const dataTestid = 'test-id';
const onCloseMock = jest.fn();

const props = {
  onClose: onCloseMock,
  popupVisible: true,
  appletId: mockedAppletId,
  'data-testid': dataTestid,
};

const testEmail = 'test@email.com';

const testValues = {
  id: 'test-id',
  appletId: mockedAppletId,
  language: 'en',
  creatorId: 'test-creator-id',
  firstName: 'test-first-name',
  lastName: 'test-last-name',
  secretUserId: 'test-secret-id',
  nickname: null,
};

describe('AddParticipantPopup component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('popup has buttons according to the account type', async () => {
    const { getByText, queryByText } = renderWithProviders(<AddParticipantPopup {...props} />);

    // Full account
    fireEvent.click(getByText('Full Account'));
    fireEvent.click(getByText('Next'));

    expect(queryByText('Send Invitation')).toBeInTheDocument();
    expect(queryByText('Create')).toBeFalsy();

    fireEvent.click(getByText('Back'));

    // Limited account
    fireEvent.click(getByText('Limited Account'));
    fireEvent.click(getByText('Next'));

    expect(queryByText('Send Invitation')).toBeFalsy();
    expect(queryByText('Create')).toBeInTheDocument();
  });

  test('should submit the Full Account form and show success banner', async () => {
    const mixpanelTrack = jest.spyOn(MixpanelFunc.Mixpanel, 'track');
    mockAxios.post.mockResolvedValueOnce({
      data: {
        result: {
          ...testValues,
          email: testEmail,
        },
      },
    });

    const { getByText, getByTestId, store } = renderWithProviders(
      <AddParticipantPopup {...props} />,
    );

    fireEvent.click(getByText('Full Account'));
    fireEvent.click(getByText('Next'));

    const emailInput = getByTestId(`${dataTestid}-email`).querySelector('input');
    emailInput && (await userEvent.type(emailInput, testEmail));
    const secretIdInput = getByTestId(`${dataTestid}-secret-id`).querySelector('input');
    secretIdInput && (await userEvent.type(secretIdInput, testValues.secretUserId));
    const firstNameInput = getByTestId(`${dataTestid}-fname`).querySelector('input');
    firstNameInput && (await userEvent.type(firstNameInput, testValues.firstName));
    const lastNameInput = getByTestId(`${dataTestid}-lname`).querySelector('input');
    lastNameInput && (await userEvent.type(lastNameInput, testValues.lastName));

    await userEvent.click(getByText('Send Invitation'));

    await waitFor(() => {
      expectBanner(store, 'AddParticipantSuccessBanner');
    });
    expect(mixpanelTrack).toBeCalledWith('Invitation sent successfully');
  });

  test('should submit the Limited Account form and show success banner', async () => {
    const mixpanelTrack = jest.spyOn(MixpanelFunc.Mixpanel, 'track');
    mockAxios.post.mockResolvedValueOnce({
      data: {
        result: testValues,
      },
    });

    const { getByText, getByTestId, store } = renderWithProviders(
      <AddParticipantPopup {...props} />,
    );

    fireEvent.click(getByText('Limited Account'));
    fireEvent.click(getByText('Next'));

    const secretIdInput = getByTestId(`${dataTestid}-secret-id`).querySelector('input');
    secretIdInput && (await userEvent.type(secretIdInput, testValues.secretUserId));
    const firstNameInput = getByTestId(`${dataTestid}-fname`).querySelector('input');
    firstNameInput && (await userEvent.type(firstNameInput, testValues.firstName));
    const lastNameInput = getByTestId(`${dataTestid}-lname`).querySelector('input');
    lastNameInput && (await userEvent.type(lastNameInput, testValues.lastName));

    await userEvent.click(getByText('Create'));

    await waitFor(() => {
      expectBanner(store, 'AddParticipantSuccessBanner');
    });
    expect(mixpanelTrack).toBeCalledWith('Shell account created successfully');
  });
});
