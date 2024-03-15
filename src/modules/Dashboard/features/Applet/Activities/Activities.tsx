import { useEffect, useState } from 'react';

import { Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';

export const Activities = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: https://mindlogger.atlassian.net/browse/M2-5443
    // This is just a placeholder until we implement the activities view
    window.setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return <StyledBody>{isLoading ? <Spinner /> : null}</StyledBody>;
};
