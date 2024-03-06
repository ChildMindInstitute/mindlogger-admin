import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { BuilderContainer } from 'shared/features/BuilderContainer';
import { Tooltip } from 'shared/components/Tooltip';
import { StyledTitleSmall } from 'shared/styles/styledComponents/Typography';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents/Flex';

import {
  StyledContent,
  StyledSettingsGroup,
  StyledSettings,
  StyledSetting,
  StyledTitle,
} from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Actions } from '../Actions';

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
    <BuilderContainer
      title={t(title)}
      sxProps={containerSxProps}
      data-testid="navigation-menu-left-bar"
    >
      <Actions isCompact={hasActiveItem} />
      <StyledContent isCompact={hasActiveItem}>
        {items.map(
          ({ label, items, isVisible = true }, index) =>
            isVisible && (
              <StyledSettingsGroup
                key={label}
                isCompact={hasActiveItem}
                data-testid={`navigation-menu-left-bar-group-${index}`}
              >
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
                        <Tooltip
                          tooltipTitle={tooltip ? t(tooltip) : null}
                          key={`item-setting-${label}`}
                        >
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
                              {hasError && (
                                <Badge
                                  data-testid="error-badge"
                                  variant="dot"
                                  invisible={!hasError}
                                  color="error"
                                />
                              )}
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
