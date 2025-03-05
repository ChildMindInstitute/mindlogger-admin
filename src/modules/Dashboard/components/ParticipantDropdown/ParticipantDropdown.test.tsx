import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  mockedFullParticipant1WithDataAccess,
  mockedOwnerParticipantWithDataAccess,
} from 'shared/mock';

import { ParticipantDropdown } from './ParticipantDropdown';
import { ParticipantDropdownOption } from './ParticipantDropdown.types';
import { participantToOption } from './ParticipantDropdown.utils';

jest.mock('shared/hooks/useFeatureFlags');

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('ParticipantDropdown', () => {
  const dataTestId = 'test';

  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  test('Shows placeholder', () => {
    const { queryByPlaceholderText } = renderWithProviders(
      <ParticipantDropdown
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
      <ParticipantDropdown
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
      <ParticipantDropdown
        name="test"
        options={[]}
        value={testValue}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByDisplayValue(testValue.secretId as string)).toBeInTheDocument();
  });
});

describe('participantToOption', () => {
  test('converts regular participant to option correctly', () => {
    const result = participantToOption(mockedFullParticipant1WithDataAccess);

    expect(result).toEqual({
      id: 'subject-id-987',
      userId: 'b60a142d-2b7f-4328-841c-dbhjhj4afcf1c7',
      secretId: 'mockedSecretId',
      nickname: 'Mocked Respondent',
      tag: 'Child',
      isTeamMember: false,
      roles: ['respondent'],
    });
  });

  test('handles team member correctly', () => {
    const result = participantToOption(mockedOwnerParticipantWithDataAccess);

    expect(result.isTeamMember).toBe(true);
    expect(result.roles).toEqual(['owner', 'respondent']);
  });

  test('handles team member with missing nickname', () => {
    const teamMemberWithoutNickname = {
      ...mockedOwnerParticipantWithDataAccess,
      nicknames: [],
    };

    const result = participantToOption(teamMemberWithoutNickname);

    expect(result.nickname).toBe('Jane Doe');
    expect(result.isTeamMember).toBe(true);
  });

  test('handles participant with tag', () => {
    const result = participantToOption(mockedFullParticipant1WithDataAccess);

    expect(result.tag).toBe('Child');
  });
});
