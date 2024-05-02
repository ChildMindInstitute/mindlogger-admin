import { useState, MouseEvent } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleTooltipIcon,
  theme,
  variables,
} from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

import {
  StyledItemOption,
  StylesTitleWrapper,
  StyledBadge,
  StyledTitleContainer,
} from './ToggleItemContainer.styles';
import { ToggleItemProps } from './ToggleItemContainer.types';

export const ToggleItemContainer = ({
  title,
  HeaderContent,
  Content,
  headerContentProps,
  contentProps,
  uiType,
  isOpenByDefault,
  isOpenDisabled,
  tooltip,
  errorMessage,
  hasError,
  headerToggling,
  'data-testid': dataTestid,
}: ToggleItemProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(isOpenByDefault ?? true);
  const handleToggle = toggleBooleanState(setOpen);
  const handleToggleBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleToggle();
  };

  const hasErrorMessage = !open && !!errorMessage;
  const titleErrorVisible = !open && (!!errorMessage || hasError);
  const isHeaderClickable = headerToggling && !isOpenDisabled;

  return (
    <StyledItemOption uiType={uiType} data-testid={dataTestid}>
      <StylesTitleWrapper
        open={open}
        uiType={uiType}
        isError={titleErrorVisible}
        headerClickable={isHeaderClickable}
        data-testid={`${dataTestid}-header`}
        onClick={isHeaderClickable ? handleToggle : undefined}
      >
        <StyledFlexTopCenter
          sx={{ flexGrow: 1, overflow: titleErrorVisible ? 'visible' : 'hidden' }}
        >
          <StyledFlexTopCenter>
            <StyledClearedButton
              onClick={handleToggleBtnClick}
              sx={{ p: theme.spacing(0.8) }}
              disabled={isOpenDisabled}
              data-testid={`${dataTestid}-collapse`}
            >
              <Svg id={open ? 'navigate-up' : 'navigate-down'} />
            </StyledClearedButton>
            {title && (
              <StyledFlexColumn data-testid={`${dataTestid}-title`}>
                <StyledTitleContainer hasError={!!titleErrorVisible}>
                  {titleErrorVisible && <StyledBadge variant="dot" color="error" />}
                  <StyledFlexTopCenter>
                    <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
                  </StyledFlexTopCenter>
                </StyledTitleContainer>
                {hasErrorMessage && (
                  <StyledBodyMedium
                    sx={{ p: theme.spacing(0.5, 0, 0, 1.5) }}
                    color={variables.palette.semantic.error}
                  >
                    {t(errorMessage)}
                  </StyledBodyMedium>
                )}
              </StyledFlexColumn>
            )}
          </StyledFlexTopCenter>
          {HeaderContent && (
            <HeaderContent open={open} onToggle={handleToggle} {...headerContentProps} />
          )}
        </StyledFlexTopCenter>
        {tooltip && (
          <Tooltip tooltipTitle={tooltip}>
            <Box component="span" sx={{ height: '2rem' }}>
              <StyledTitleTooltipIcon width="2rem" height="2rem" id="more-info-outlined" />
            </Box>
          </Tooltip>
        )}
      </StylesTitleWrapper>
      {open && <Content {...contentProps} />}
    </StyledItemOption>
  );
};
