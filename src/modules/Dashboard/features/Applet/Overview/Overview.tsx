import { useEffect, useState } from 'react';

import { Spinner } from 'shared/components';
import { StyledBody } from 'shared/styles';

export const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: https://mindlogger.atlassian.net/browse/M2-XXXX
    // This is just a placeholder until we implement the Overview view
    window.setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return <StyledBody>{isLoading ? <Spinner /> : null}</StyledBody>;
};
