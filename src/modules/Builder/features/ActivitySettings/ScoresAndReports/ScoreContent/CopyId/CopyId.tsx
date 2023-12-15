import { StyledFlexTopCenter, StyledTitleSmall, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';

import { CopyIdProps } from './CopyId.types';
import { StyledDuplicateButton, StyledValue } from './CopyId.styles';

export const CopyId = ({
  title,
  value,
  showCopy = false,
  'data-testid': dataTestid,
}: CopyIdProps) => {
  const copyScoreId = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <>
      <StyledTitleSmall sx={{ mb: theme.spacing(1.2) }}>{title}</StyledTitleSmall>
      <StyledFlexTopCenter>
        <StyledValue data-testid={`${dataTestid}-scoreid`}>{value}</StyledValue>
        {showCopy && (
          <StyledDuplicateButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={copyScoreId}
            data-testid={`${dataTestid}-copy`}
          >
            <Svg id="duplicate" width="20" height="20" />
          </StyledDuplicateButton>
        )}
      </StyledFlexTopCenter>
    </>
  );
};
