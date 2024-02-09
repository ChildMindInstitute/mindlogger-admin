import { Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Tooltip } from 'shared/components/Tooltip';
import { BuilderContainer } from 'shared/features/BuilderContainer';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents/Flex';
import { StyledTitleSmall } from 'shared/styles/styledComponents/Typography';
import { variables } from 'shared/styles/variables';

import { StyledContent, StyledSettingsGroup, StyledSettings, StyledSetting, StyledTitle } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';

export const LeftBar = ({ title, items, hasActiveItem, onItemClick }: LeftBarProps) => {
  const { setting } = useParams();
  const { t } = useTranslation('app');

  const containerSxProps = {
    width: hasActiveItem ? '40rem' : '100%',
    flexShrink: 0,
    borderRight: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
    height: '100%',
    transition: variables.transitions.width,
    margin: 0,
  };

  return (
    <BuilderContainer title={t(title)} sxProps={containerSxProps}>
      <StyledContent isCompact={hasActiveItem}>
        {items.map(
          ({ label, items, isVisible = true }) =>
            isVisible && (
              <StyledSettingsGroup key={label} isCompact={hasActiveItem}>
                <StyledTitleSmall>{t(label)}</StyledTitleSmall>
                <StyledSettings isCompact={hasActiveItem}>
                  {items.map(
                    ({
                      icon,
                      label,
                      component,
                      param,
                      disabled,
                      tooltip,
                      isVisible: isItemVisible = true,
                      hasError = false,
                      onClick,
                      'data-testid': dataTestid,
                    }) =>
                      isItemVisible && (
                        <Tooltip tooltipTitle={tooltip ? t(tooltip) : null} key={`item-setting-${label}`}>
                          <span>
                            <StyledSetting
                              onClick={() =>
                                onItemClick({
                                  label,
                                  component,
                                  param,
                                  icon,
                                  disabled,
                                  tooltip,
                                  onClick,
                                })
                              }
                              isCompact={hasActiveItem}
                              isSelected={!disabled && setting === param}
                              disabled={disabled}
                              data-testid={dataTestid}
                            >
                              <StyledFlexAllCenter>{icon}</StyledFlexAllCenter>
                              <StyledTitle>{t(label)}</StyledTitle>
                              {hasError && <Badge variant="dot" invisible={!hasError} color="error" />}
                            </StyledSetting>
                          </span>
                        </Tooltip>
                      ),
                  )}
                </StyledSettings>
              </StyledSettingsGroup>
            ),
        )}
      </StyledContent>
    </BuilderContainer>
  );
};
