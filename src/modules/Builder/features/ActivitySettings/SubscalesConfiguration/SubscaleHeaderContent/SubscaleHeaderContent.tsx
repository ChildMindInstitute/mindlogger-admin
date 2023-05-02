import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { SubscaleHeaderContentProps } from './SubscaleHeaderContent.types';

export const SubscaleHeaderContent = ({ onRemove }: SubscaleHeaderContentProps) => {
  const handleOnLookupTable = () => false;

  return (
    <StyledFlexTopCenter>
      <StyledClearedButton
        sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
        onClick={handleOnLookupTable}
      >
        <Svg id="lookup-table" width="20" height="20" />
      </StyledClearedButton>
      <StyledClearedButton sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }} onClick={onRemove}>
        <Svg id="trash" width="20" height="20" />
      </StyledClearedButton>
    </StyledFlexTopCenter>
  );
};
