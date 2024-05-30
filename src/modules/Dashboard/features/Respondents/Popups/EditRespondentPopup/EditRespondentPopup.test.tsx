import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { expectBanner } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { EditRespondentPopup } from '.';

const onCloseMock = jest.fn();
const successFakeRequest = jest.fn();

const chosenAppletData = {
  appletId: '12312',
  respondentSecretId: '12312',
  respondentId: '12312',
  respondentNickname: 'respondentNickname',
  ownerId: '1',
  subjectId: 'subj-1',
  subjectTag: 'Child',
} as const;

const commonProps = {
  onClose: onCloseMock,
  popupVisible: true,
  chosenAppletData,
};

const mockedAxios = axios.create();

describe('EditRespondentPopup component tests', () => {
  beforeEach(() => {
    successFakeRequest.mockReturnValue(new Promise((res) => res(null)));
    jest.spyOn(mockedAxios, 'put').mockImplementation(successFakeRequest);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('EditRespondentPopup should appear with respondentSecretId and respondentNickname', async () => {
    renderWithProviders(<EditRespondentPopup {...commonProps} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(chosenAppletData.respondentSecretId)).toBeInTheDocument();
      expect(screen.getByDisplayValue(chosenAppletData.respondentNickname)).toBeInTheDocument();
      expect(screen.getByDisplayValue(chosenAppletData.subjectTag)).toBeInTheDocument();
    });
  });

  test('EditRespondentPopup should appear success text', async () => {
    const { store } = renderWithProviders(<EditRespondentPopup {...commonProps} />);

    const nicknameInput = screen
      .getByTestId('dashboard-respondents-edit-popup-nickname')
      .querySelector('input') as HTMLInputElement;
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, 'john');

    const submitButton = screen.getByTestId('dashboard-respondents-edit-popup-submit-button');
    await userEvent.click(submitButton);
    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));
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
      const selection = screen.getByTestId('dashboard-respondents-edit-popup-tag');
      const toggleBtn = selection.querySelector('[aria-haspopup="listbox"][role="button"]');
      const submitBtn = screen.getByTestId('dashboard-respondents-edit-popup-submit-button');

      await userEvent.click(toggleBtn as HTMLElement);

      const dropdown = screen.queryByTestId('dashboard-respondents-edit-popup-tag-dropdown');
      const dropdownOption = dropdown?.querySelector(`[data-value='Parent']`);

      await userEvent.click(dropdownOption as HTMLElement);
      await userEvent.click(submitBtn);

      expect(successFakeRequest).toBeCalledWith(
        `/subjects/${chosenAppletData.subjectId}`,
        {
          nickname: chosenAppletData.respondentNickname,
          secretUserId: chosenAppletData.respondentSecretId,
          tag: 'Parent',
        },
        { signal: undefined },
      );
    });
  });
});
