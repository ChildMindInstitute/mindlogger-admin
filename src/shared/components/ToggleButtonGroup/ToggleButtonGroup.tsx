import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { StyledBodyLarge, StyledHeadlineSmall } from 'shared/styles';

import { StyledIcon, StyledToggleBtn, StyledToggleButtonGroup } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps, ToggleButtonVariants } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  variant = ToggleButtonVariants.Default,
  toggleButtons,
  activeButton,
  setActiveButton,
  customChange,
  'data-testid': dataTestid,
}: ToggleButtonGroupProps) => {
  const { t } = useTranslation('app');

  const handleChange = (e: MouseEvent<HTMLElement>, selected: string | number) => {
    if (selected || selected === 0) {
      customChange && customChange(selected);
      setActiveButton && setActiveButton(selected);
    }
  };

  const isDefaultVariant = variant === ToggleButtonVariants.Default;

  return (
    <StyledToggleButtonGroup
      fullWidth
      value={activeButton}
      exclusive
      onChange={handleChange}
      variant={variant}
      data-testid={dataTestid}
    >
      {toggleButtons.map(({ value, label, tooltip, description, icon }, index) => (
        <StyledToggleBtn
          sx={{
            flex: isDefaultVariant ? `0 0 calc(100% / ${toggleButtons.length})` : '1',
          }}
          withIcon={!!icon}
          key={value}
          value={value}
          variant={variant}
          data-testid={`${dataTestid}-${index}`}
        >
          {activeButton === value && !icon && (
            <StyledIcon variant={variant}>
              <Svg id="check" />
            </StyledIcon>
          )}
          {icon && <StyledIcon variant={variant}>{icon}</StyledIcon>}
          <Tooltip tooltipTitle={t(tooltip || '')}>
            {isDefaultVariant ? (
              <span> {t(label)}</span>
            ) : (
              <StyledHeadlineSmall>{t(label)}</StyledHeadlineSmall>
            )}
          </Tooltip>
          {!isDefaultVariant && <StyledBodyLarge>{description}</StyledBodyLarge>}
        </StyledToggleBtn>
      ))}
    </StyledToggleButtonGroup>
  );
};
