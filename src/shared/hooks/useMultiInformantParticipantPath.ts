import { generatePath } from 'react-router-dom';

import { page } from 'resources';
import { useLaunchDarkly } from 'shared/hooks/useLaunchDarkly';

export function useMultiInformantParticipantPath(pathOptions: { appletId?: string | null }) {
  const {
    flags: { enableMultiInformant },
  } = useLaunchDarkly();

  return generatePath(
    enableMultiInformant ? page.appletParticipants : page.appletRespondents,
    pathOptions,
  );
}
