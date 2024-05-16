import { useEffect } from 'react';

import { StyledBody } from 'shared/styles';
import { Mixpanel } from 'shared/utils';
import { RespondentData as RespondentDataFeature } from 'modules/Dashboard/features/RespondentData';

export const RespondentData = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Data Viz');
  }, []);

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <RespondentDataFeature />
    </StyledBody>
  );
};

export default RespondentData;
