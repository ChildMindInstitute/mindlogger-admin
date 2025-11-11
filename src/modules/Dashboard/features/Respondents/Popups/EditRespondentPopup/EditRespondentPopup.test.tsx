import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';
import { mockedAppletId } from 'shared/mock';
import { expectBanner } from 'shared/utils';
import { EditSubjectResponse } from 'api';
import { useEditSubjectMutation } from 'modules/Dashboard/api/apiSlice';

import { EditRespondentPopup } from '.';

vi.mock('modules/Dashboard/api/apiSlice');

const onCloseMock = vi.fn();
const mixpanelTrack = vi.spyOn(Mixpanel, 'track');
const mockEditSubject = vi.fn();

const mockedUseEditSubjectMutation = vi.mocked(useEditSubjectMutation);

const chosenAppletData = {
  appletId: mockedAppletId,
  respondentSecretId: '12312',
  respondentId: '12312',
  respondentNickname: 'respondentNickname',
  ownerId: '1',
  subjectId: 'subj-1',
  subjectTag: 'Child',
  createdAt: '2025-01-01T00:00:00',
} as const;

const commonProps = {
  onClose: onCloseMock,
  popupVisible: true,
  chosenAppletData,
};

describe('EditRespondentPopup component tests', () => {
  beforeEach(() => {
    mockEditSubject.mockResolvedValue({
      data: {
        result: {
          ...chosenAppletData,
          tag: chosenAppletData.subjectTag,
        },
      },
    });
    mockedUseEditSubjectMutation.mockReturnValue([
      mockEditSubject,
      { isLoading: false, error: undefined },
    ] as unknown as ReturnType<typeof useEditSubjectMutation>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('EditRespondentPopup should appear with respondentSecretId, respondentNickname, subjectTag', async () => {
    renderWithProviders(<EditRespondentPopup {...commonProps} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(chosenAppletData.respondentSecretId)).toBeInTheDocument();
      expect(screen.getByDisplayValue(chosenAppletData.respondentNickname)).toBeInTheDocument();
      expect(screen.getByDisplayValue(chosenAppletData.subjectTag)).toBeInTheDocument();
    });
  });

  test('EditRespondentPopup submission of Limited Account should show success text', async () => {
    const limitedAppletData = {
      ...chosenAppletData,
      respondentId: null,
    };
    const limitedProps = {
      ...commonProps,
      chosenAppletData: limitedAppletData,
    };
    mockEditSubject.mockResolvedValueOnce({
      data: {
        result: {
          ...limitedAppletData,
          tag: limitedAppletData.subjectTag,
        },
      },
    });

    const { store } = renderWithProviders(<EditRespondentPopup {...limitedProps} />);

    const nicknameInput = screen
      .getByTestId('dashboard-respondents-edit-popup-nickname')
      .querySelector('input') as HTMLInputElement;
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, 'john');

    const submitButton = screen.getByTestId('dashboard-respondents-edit-popup-submit-button');
    await userEvent.click(submitButton);

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.EditLimitedAccountFormSubmitted,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });

    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.LimitedAccountEditedSuccessfully,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });
  });

  test('EditRespondentPopup submission of Full Account should show success text', async () => {
    const result: EditSubjectResponse = {
      id: 'subj-1',
      appletId: mockedAppletId,
      secretUserId: '12312',
      userId: '12312',
      nickname: 'respondentNickname',
      lastSeen: null,
      tag: chosenAppletData.subjectTag,
      firstName: null,
      lastName: null,
    };

    mockEditSubject.mockResolvedValueOnce({
      data: {
        result,
      },
    });

    const { store } = renderWithProviders(<EditRespondentPopup {...commonProps} />);

    const nicknameInput = screen
      .getByTestId('dashboard-respondents-edit-popup-nickname')
      .querySelector('input') as HTMLInputElement;
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, 'john');

    const submitButton = screen.getByTestId('dashboard-respondents-edit-popup-submit-button');
    await userEvent.click(submitButton);

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.EditFullAccountFormSubmitted,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });

    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.FullAccountEditedSuccessfully,
      [MixpanelProps.AppletId]: mockedAppletId,
      [MixpanelProps.Tag]: 'Child',
    });
  });

  describe("When the given subjectʼs tag is 'Team'", () => {
    beforeEach(() => {
      renderWithProviders(
        <EditRespondentPopup
          {...commonProps}
          chosenAppletData={{ ...chosenAppletData, subjectTag: 'Team' }}
        />,
      );
    });

    test('It disables tag selection', () => {
      const selection = screen.queryByTestId('dashboard-respondents-edit-popup-tag');
      // Query for deeply nested child, as MUI Select is not a native HTML
      // <select>, and the testId is only applied to root element.
      const toggleBtn = selection?.querySelector('[aria-haspopup="listbox"][role="button"]');

      expect(selection).toBeInTheDocument();
      expect(toggleBtn).toHaveAttribute('aria-disabled');
    });
  });

  describe("When the given subjectʼs tag is not 'Team'", () => {
    beforeEach(() => {
      renderWithProviders(<EditRespondentPopup {...commonProps} />);
    });

    test('It enables tag selection', () => {
      const selection = screen.queryByTestId('dashboard-respondents-edit-popup-tag');

      expect(selection).toBeInTheDocument();
      expect(selection).not.toHaveProperty('disabled');
    });

    test('It accepts changes to the subjectʼs tag value', async () => {
      mockEditSubject.mockResolvedValueOnce({
        data: {
          result: {
            ...chosenAppletData,
            tag: chosenAppletData.subjectTag,
          },
        },
      });

      const selection = screen.getByTestId('dashboard-respondents-edit-popup-tag');
      const toggleBtn = selection.querySelector('[aria-haspopup="listbox"][role="button"]');
      const submitBtn = screen.getByTestId('dashboard-respondents-edit-popup-submit-button');

      await userEvent.click(toggleBtn as HTMLElement);

      const dropdown = screen.queryByTestId('dashboard-respondents-edit-popup-tag-dropdown');
      const dropdownOption = dropdown?.querySelector(`[data-value='Parent']`);

      await userEvent.click(dropdownOption as HTMLElement);
      await userEvent.click(submitBtn);

      expect(mockEditSubject).toBeCalledWith({
        subjectId: chosenAppletData.subjectId,
        values: {
          nickname: chosenAppletData.respondentNickname,
          secretUserId: chosenAppletData.respondentSecretId,
          tag: 'Parent',
        },
      });
    });
  });
});
