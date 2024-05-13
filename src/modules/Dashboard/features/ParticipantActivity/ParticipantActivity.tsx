import { useEffect } from 'react';

import { Mixpanel } from 'shared/utils';
import { StyledBody } from 'shared/styles';

import ParticipantActivityDetails from './Details';

export const ParticipantActivity = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Data Viz');
  }, []);

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <ParticipantActivityDetails />
    </StyledBody>
  );
};

export default ParticipantActivity;
