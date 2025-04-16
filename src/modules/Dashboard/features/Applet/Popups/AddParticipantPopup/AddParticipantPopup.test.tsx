import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { expectBanner, MixpanelEventType } from 'shared/utils';
import { MixpanelProps, Mixpanel } from 'shared/utils/mixpanel';
import { ParticipantTag } from 'shared/consts';

import { AddParticipantPopup } from './AddParticipantPopup';

const dataTestId = 'test-id';
const onCloseMock = vi.fn();
const mixpanelTrack = vi.spyOn(Mixpanel, 'track');

const props = {
  onClose: onCloseMock,
  popupVisible: true,
  appletId: mockedAppletId,
  'data-testid': dataTestId,
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
  tag: 'Child' as ParticipantTag,
  nickname: null,
};

describe('AddParticipantPopup component', () => {
  afterEach(() => {
    jest.resetAllMocks();
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

    const emailInput = getByTestId(`${dataTestId}-email`).querySelector('input');
    emailInput && (await userEvent.type(emailInput, testEmail));
    const secretIdInput = getByTestId(`${dataTestId}-secret-id`).querySelector('input');
    secretIdInput && (await userEvent.type(secretIdInput, testValues.secretUserId));
    const firstNameInput = getByTestId(`${dataTestId}-fname`).querySelector('input');
    firstNameInput && (await userEvent.type(firstNameInput, testValues.firstName));
    const lastNameInput = getByTestId(`${dataTestId}-lname`).querySelector('input');
    lastNameInput && (await userEvent.type(lastNameInput, testValues.lastName));
    const tagSelectButton = within(getByTestId(`${dataTestId}-tag`)).getByRole('button');
    await userEvent.click(tagSelectButton);
    const roleOptions = await screen.findByRole('listbox', { name: 'Tag' });
    await userEvent.click(within(roleOptions).getByText('Child'));

    await userEvent.click(getByText('Send Invitation'));

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.FullAccountInvitationFormSubmitted,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });

    await waitFor(() => {
      expectBanner(store, 'AddParticipantSuccessBanner');
    });

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.FullAccountInvitationCreated,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });
  });

  test('should submit the Limited Account form and show success banner', async () => {
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

    const secretIdInput = getByTestId(`${dataTestId}-secret-id`).querySelector('input');
    secretIdInput && (await userEvent.type(secretIdInput, testValues.secretUserId));
    const firstNameInput = getByTestId(`${dataTestId}-fname`).querySelector('input');
    firstNameInput && (await userEvent.type(firstNameInput, testValues.firstName));
    const lastNameInput = getByTestId(`${dataTestId}-lname`).querySelector('input');
    lastNameInput && (await userEvent.type(lastNameInput, testValues.lastName));
    const tagSelectButton = within(getByTestId(`${dataTestId}-tag`)).getByRole('button');
    await userEvent.click(tagSelectButton);
    const roleOptions = await screen.findByRole('listbox', { name: 'Tag' });
    await userEvent.click(within(roleOptions).getByText('Child'));

    await userEvent.click(getByText('Create'));

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.AddLimitedAccountFormSubmitted,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });

    await waitFor(() => {
      expectBanner(store, 'AddParticipantSuccessBanner');
    });

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.LimitedAccountCreated,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });
  });
});
