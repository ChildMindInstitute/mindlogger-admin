import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import {
  theme,
  StyledFlexTopCenter,
  StyledClearedButton,
  StyledLabelBoldLarge,
} from 'shared/styles';

import { ColorPaletteHeaderProps } from './ColorPaletteHeader.types';

const commonButtonStyles = {
  p: theme.spacing(1),
  mr: theme.spacing(0.2),
};

export const ColorPaletteHeader = ({
  isExpanded,
  onArrowClick,
  onTrashClick,
}: ColorPaletteHeaderProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledFlexTopCenter sx={{ gap: '2.4rem' }}>
      <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles}>
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge sx={{ flexGrow: 1 }}>{t('colorPalette')}</StyledLabelBoldLarge>
      <StyledClearedButton onClick={onTrashClick} sx={commonButtonStyles}>
        <Svg id="trash" />
      </StyledClearedButton>
    </StyledFlexTopCenter>
  );
};
