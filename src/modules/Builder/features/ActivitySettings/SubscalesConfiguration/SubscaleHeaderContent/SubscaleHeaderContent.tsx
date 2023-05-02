import { Box } from '@mui/material';

import { StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { TitleComponent } from '../TitleComponent';
import { SubscaleHeaderContentProps } from './SubscaleHeaderContent.types';
import { StyledWrapper } from './SubscaleHeaderContent.styles';

export const SubscaleHeaderContent = ({
  onRemove,
  name,
  title,
  open,
}: SubscaleHeaderContentProps) => {
  const handleOnLookupTable = () => false;

  return (
    <StyledWrapper>
      <TitleComponent title={title} name={name} open={open} />
      <Box>
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          onClick={handleOnLookupTable}
        >
          <Svg id="lookup-table" width="20" height="20" />
        </StyledClearedButton>
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          onClick={onRemove}
        >
          <Svg id="trash" width="20" height="20" />
        </StyledClearedButton>
      </Box>
    </StyledWrapper>
  );
};
