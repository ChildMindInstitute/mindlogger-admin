import { useFeatureFlags } from 'shared/hooks';

import Activities from './Activities';
import AboutParticipant from './Assignments/AboutParticipant';

const ParticipantDetails = () => {
  const { featureFlags } = useFeatureFlags();

  return featureFlags.enableActivityAssign ? <AboutParticipant /> : <Activities />;
};

export default ParticipantDetails;
