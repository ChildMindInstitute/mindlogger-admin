import { renderHook } from '@testing-library/react';

import * as featureFlagsHook from 'shared/hooks/useFeatureFlags';
import { useMultiInformantParticipantPath } from 'shared/hooks/useMultiInformantParticipantPath';

const appletId = `applet-test-id`;

describe('useMultiInformantParticipantPath', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when `enableMultiInformant` is set', () => {
    beforeEach(() => {
      jest
        .spyOn(featureFlagsHook, 'useFeatureFlags')
        .mockReturnValue({ featureFlags: { enableMultiInformant: true } } as unknown as ReturnType<
          typeof featureFlagsHook.useFeatureFlags
        >);
    });

    test('it returns the participant path', async () => {
      const { result } = renderHook(() => useMultiInformantParticipantPath({ appletId }));

      expect(result.current).toEqual('/dashboard/applet-test-id/participants');
    });
  });

  describe('when `enableMultiInformant` is not set', () => {
    beforeEach(() => {
      jest
        .spyOn(featureFlagsHook, 'useFeatureFlags')
        .mockReturnValue({ featureFlags: { enableMultiInformant: false } } as unknown as ReturnType<
          typeof featureFlagsHook.useFeatureFlags
        >);
    });

    test('it returns the respondent path', async () => {
      const { result } = renderHook(() => useMultiInformantParticipantPath({ appletId }));

      expect(result.current).toEqual('/dashboard/applet-test-id/respondents');
    });
  });
});
