import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedSubjectId1 } from 'shared/mock';
import { Mixpanel, MixpanelProps, expectBanner, MixpanelEventType } from 'shared/utils';
import { ParticipantTag } from 'shared/consts';

import { UpgradeAccountPopup } from './UpgradeAccountPopup';

const dataTestid = 'test-id';
const onCloseMock = jest.fn();
const mixpanelTrack = jest.spyOn(Mixpanel, 'track');

const props = {
  onClose: onCloseMock,
  popupVisible: true,
  appletId: mockedAppletId,
  subjectId: mockedSubjectId1,
  secretId: 'test secret id',
  nickname: 'test nickname',
  tag: 'Child' as ParticipantTag,
  'data-testid': dataTestid,
};

const testValues = {
  language: 'en',
  email: 'test@email.com',
};

describe('UpgradeAccountPopup component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should submit the form and show success banner', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        result: testValues,
      },
    });

    const { getByText, getByTestId, store } = renderWithProviders(
      <UpgradeAccountPopup {...props} />,
    );

    const emailInput = getByTestId(`${dataTestid}-email`).querySelector('input');
    emailInput && (await userEvent.type(emailInput, testValues.email));

    await userEvent.click(getByText('Send Invitation'));

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.UpgradeToFullAccountFormSubmitted,
      [MixpanelProps.AppletId]: mockedAppletId,
    });

    await waitFor(() => {
      expectBanner(store, 'AddParticipantSuccessBanner');
    });

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.UpgradeToFullAccountInviteCreated,
      [MixpanelProps.AppletId]: mockedAppletId,
    });
  });
});
