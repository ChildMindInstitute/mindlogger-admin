import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LabeledUserDropdown } from 'modules/Dashboard/components/TakeNowModal/LabeledDropdown/LabeledUserDropdown';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { ParticipantDropdownOption } from './LabeledUserDropdown.types';

jest.mock('shared/hooks/useFeatureFlags');

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('LabeledUserDropdown', () => {
  const dataTestId = 'test';

  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: false,
      },
    });
  });

  test('Shows label', () => {
    const { queryByText } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Test Label')).toBeInTheDocument();
  });

  test('Shows tooltip on hover', async () => {
    const { queryByText, getByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Test Tooltip')).not.toBeInTheDocument();
    const tooltipIcon = getByTestId(`${dataTestId}-tooltip-icon`);
    await userEvent.hover(tooltipIcon);
    expect(await screen.findByText('Test Tooltip')).toBeInTheDocument();
  });

  test('Shows placeholder', () => {
    const { queryByPlaceholderText } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder="Test Placeholder"
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  test('Uses value if provided', () => {
    const testValue = {
      id: 'id',
      nickname: 'nickname',
      secretId: 'secretId',
      isLimitedAccount: true,
    };

    const { queryByDisplayValue } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={testValue}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(
      queryByDisplayValue(`${testValue.secretId} (${testValue.nickname})`),
    ).toBeInTheDocument();
  });

  test('Renders value correctly without nickname', () => {
    const testValue = { id: 'id', secretId: 'secretId', isLimitedAccount: true };

    const { queryByDisplayValue } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={testValue}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByDisplayValue(testValue.secretId)).toBeInTheDocument();
  });

  test('Does not show warning message when the value is not present', () => {
    const { queryByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
        canShowWarningMessage={true}
      />,
    );

    expect(queryByTestId(`${dataTestId}-warning-message`)).not.toBeInTheDocument();
  });

  test('Does not show warning for team members', () => {
    const option: ParticipantDropdownOption = {
      id: 'subject-id',
      userId: 'user-id',
      tag: 'Team',
    };

    const { queryByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[option]}
        value={option}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
        canShowWarningMessage={true}
      />,
    );

    expect(queryByTestId(`${dataTestId}-warning-message`)).not.toBeInTheDocument();
  });

  test('Shows warning for full account participants', () => {
    const option: ParticipantDropdownOption = {
      id: 'subject-id',
      userId: 'user-id',
      tag: 'Teacher',
    };

    const { queryByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[option]}
        value={option}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
        canShowWarningMessage={true}
      />,
    );

    expect(queryByTestId(`${dataTestId}-warning-message`)).toBeInTheDocument();
  });

  test('Shows warning for limited account participants', () => {
    const option: ParticipantDropdownOption = {
      id: 'subject-id',
      tag: 'Child',
    };

    const { queryByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[option]}
        value={option}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
        canShowWarningMessage={true}
      />,
    );

    expect(queryByTestId(`${dataTestId}-warning-message`)).toBeInTheDocument();
  });

  test('Does not show warning when canShowWarningMessage = false', () => {
    const option: ParticipantDropdownOption = {
      id: 'subject-id',
      tag: 'Child',
    };

    const { queryByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[option]}
        value={option}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
        canShowWarningMessage={false}
      />,
    );

    expect(queryByTestId(`${dataTestId}-warning-message`)).not.toBeInTheDocument();
  });

  describe('featureFlags.enableParticipantMultiInformant = true', () => {
    beforeEach(() => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: {
          enableParticipantMultiInformant: true,
        },
      });
    });

    test('Does not show warning for team members', () => {
      const option: ParticipantDropdownOption = {
        id: 'subject-id',
        userId: 'user-id',
        tag: 'Team',
      };

      const { queryByTestId } = renderWithProviders(
        <LabeledUserDropdown
          label="Test Label"
          tooltip="Test Tooltip"
          name="test"
          options={[option]}
          value={option}
          placeholder=""
          onChange={jest.fn()}
          data-testid={dataTestId}
          canShowWarningMessage={true}
        />,
      );

      expect(queryByTestId(`${dataTestId}-warning-message`)).not.toBeInTheDocument();
    });

    test('Does not show warning for full account participants', () => {
      const option: ParticipantDropdownOption = {
        id: 'subject-id',
        userId: 'user-id',
        tag: 'Teacher',
      };

      const { queryByTestId } = renderWithProviders(
        <LabeledUserDropdown
          label="Test Label"
          tooltip="Test Tooltip"
          name="test"
          options={[option]}
          value={option}
          placeholder=""
          onChange={jest.fn()}
          data-testid={dataTestId}
          canShowWarningMessage={true}
        />,
      );

      expect(queryByTestId(`${dataTestId}-warning-message`)).not.toBeInTheDocument();
    });

    test('Shows warning for limited account participants', () => {
      const option: ParticipantDropdownOption = {
        id: 'subject-id',
        tag: 'Child',
      };

      const { queryByTestId } = renderWithProviders(
        <LabeledUserDropdown
          label="Test Label"
          tooltip="Test Tooltip"
          name="test"
          options={[option]}
          value={option}
          placeholder=""
          onChange={jest.fn()}
          data-testid={dataTestId}
          canShowWarningMessage={true}
        />,
      );

      expect(queryByTestId(`${dataTestId}-warning-message`)).toBeInTheDocument();
    });

    test('Does not show warning when canShowWarningMessage = false', () => {
      const option: ParticipantDropdownOption = {
        id: 'subject-id',
        tag: 'Child',
      };

      const { queryByTestId } = renderWithProviders(
        <LabeledUserDropdown
          label="Test Label"
          tooltip="Test Tooltip"
          name="test"
          options={[option]}
          value={option}
          placeholder=""
          onChange={jest.fn()}
          data-testid={dataTestId}
          canShowWarningMessage={false}
        />,
      );

      expect(queryByTestId(`${dataTestId}-warning-message`)).not.toBeInTheDocument();
    });
  });
});
