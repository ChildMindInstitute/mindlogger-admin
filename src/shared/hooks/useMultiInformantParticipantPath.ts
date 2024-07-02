import { generatePath } from 'react-router-dom';

import { page } from 'resources';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

export function useMultiInformantParticipantPath(pathOptions: { appletId?: string | null }) {
  const {
    featureFlags: { enableMultiInformant },
  } = useFeatureFlags();

  return generatePath(
    enableMultiInformant ? page.appletParticipants : page.appletRespondents,
    pathOptions,
  );
}
