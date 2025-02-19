import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { ParticipantDropdown } from './ParticipantDropdown';
import { ParticipantDropdownOption } from './ParticipantDropdown.types';

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
