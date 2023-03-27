import { Box } from '@mui/system';

import { Svg } from 'shared/components';
import { theme } from 'shared/styles';

export const getTitle = (name: string, isFlow?: boolean) => {
  if (isFlow) {
    return (
      <>
        <Svg id="flow" width={16} height={16} />
        <Box sx={{ marginLeft: theme.spacing(0.4) }}>{name}</Box>
      </>
    );
  }

  return name;
};
