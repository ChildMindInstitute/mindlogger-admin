import { StyledBodyLarge, StyledFlexTopCenter, StyledTitleSmall, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { CopyIdProps } from './CopyId.types';
import { StyledDuplicateButton } from './CopyId.styles';

export const CopyId = ({ title, value, showCopy = false }: CopyIdProps) => {
  const copyScoreId = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <>
      <StyledTitleSmall sx={{ mb: theme.spacing(1.2) }}>{title}</StyledTitleSmall>
      <StyledFlexTopCenter>
        <StyledBodyLarge>{value}</StyledBodyLarge>
        {showCopy && (
          <StyledDuplicateButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={copyScoreId}
          >
            <Svg id="duplicate" width="20" height="20" />
          </StyledDuplicateButton>
        )}
      </StyledFlexTopCenter>
    </>
  );
};
