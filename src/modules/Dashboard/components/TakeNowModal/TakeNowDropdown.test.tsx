import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ParticipantDropdownOption } from 'modules/Dashboard/components';
import { Roles } from 'shared/consts';

import { TakeNowDropdown } from './TakeNowDropdown';

jest.mock('shared/hooks/useFeatureFlags');

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('TakeNowDropdown', () => {
  const dataTestId = 'test';

  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  test('Shows label', () => {
    const { queryByText } = renderWithProviders(
      <TakeNowDropdown
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
      <TakeNowDropdown
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
      <TakeNowDropdown
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
    const testValue: ParticipantDropdownOption = {
      id: 'id',
      nickname: 'nickname',
      secretId: 'secretId',
      isTeamMember: false,
      roles: [],
    };

    const { queryByDisplayValue } = renderWithProviders(
      <TakeNowDropdown
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
    const testValue: ParticipantDropdownOption = {
      id: 'id',
      secretId: 'secretId',
      isTeamMember: false,
      roles: [],
    };

    const { queryByDisplayValue } = renderWithProviders(
      <TakeNowDropdown
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

    expect(queryByDisplayValue(testValue.secretId!)).toBeInTheDocument();
  });

  test('Does not show warning message when the value is not present', () => {
    const { queryByTestId } = renderWithProviders(
      <TakeNowDropdown
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
      isTeamMember: true,
      roles: [Roles.Owner, Roles.Respondent],
    };

    const { queryByTestId } = renderWithProviders(
      <TakeNowDropdown
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
      isTeamMember: false,
      roles: [Roles.Respondent],
    };

    const { queryByTestId } = renderWithProviders(
      <TakeNowDropdown
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
      isTeamMember: false,
      roles: [],
    };

    const { queryByTestId } = renderWithProviders(
      <TakeNowDropdown
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
      isTeamMember: false,
      roles: [],
    };

    const { queryByTestId } = renderWithProviders(
      <TakeNowDropdown
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
        resetLDContext: jest.fn(),
      });
    });

    test('Does not show warning for team members', () => {
      const option: ParticipantDropdownOption = {
        id: 'subject-id',
        userId: 'user-id',
        tag: 'Team',
        isTeamMember: true,
        roles: [Roles.Owner, Roles.Respondent],
      };

      const { queryByTestId } = renderWithProviders(
        <TakeNowDropdown
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
        isTeamMember: false,
        roles: [Roles.Respondent],
      };

      const { queryByTestId } = renderWithProviders(
        <TakeNowDropdown
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
        isTeamMember: false,
        roles: [],
      };

      const { queryByTestId } = renderWithProviders(
        <TakeNowDropdown
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
        isTeamMember: false,
        roles: [],
      };

      const { queryByTestId } = renderWithProviders(
        <TakeNowDropdown
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
