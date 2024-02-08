import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { theme, StyledFlexTopCenter, StyledClearedButton, StyledLabelBoldLarge } from 'shared/styles';

import { ColorPaletteHeaderProps } from './ColorPaletteHeader.types';

const commonButtonStyles = {
  p: theme.spacing(1),
  mr: theme.spacing(0.2),
};

export const ColorPaletteHeader = ({ isExpanded, onArrowClick, onRemovePalette }: ColorPaletteHeaderProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledFlexTopCenter sx={{ gap: '2.4rem', mb: theme.spacing(0.5) }}>
      <StyledClearedButton
        onClick={onArrowClick}
        sx={commonButtonStyles}
        data-testid="builder-activity-items-item-configuration-color-palette-collapse">
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge sx={{ flexGrow: 1 }}>{t('colorPalette')}</StyledLabelBoldLarge>
      <StyledClearedButton
        onClick={onRemovePalette}
        sx={commonButtonStyles}
        data-testid="builder-activity-items-item-configuration-color-palette-remove">
        <Svg id="trash" />
      </StyledClearedButton>
    </StyledFlexTopCenter>
  );
};
