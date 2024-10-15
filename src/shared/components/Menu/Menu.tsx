import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, ListItemIcon, MenuItem } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { StyledBodyLarge } from 'shared/styles/styledComponents';
import { Tooltip } from 'shared/components/Tooltip';

import { StyledMenu, StyledMenuItemContent } from './Menu.styles';
import { MenuItemType, MenuProps } from './Menu.types';
import { MenuUiType } from './Menu.const';

export const Menu = <T = unknown,>({
  anchorEl,
  onClose,
  menuItems,
  anchorOrigin,
  transformOrigin,
  width = 'auto',
  uiType = MenuUiType.Primary,
  'data-testid': dataTestid,
}: MenuProps<T>) => {
  const { t } = useTranslation('app');
  const open = Boolean(anchorEl);

  return (
    <StyledMenu
      MenuListProps={{
        sx: { width },
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={
        anchorOrigin || {
          vertical: 'bottom',
          horizontal: 'left',
        }
      }
      transformOrigin={
        transformOrigin || {
          vertical: 'top',
          horizontal: 'left',
        }
      }
      uiType={uiType}
      data-testid={dataTestid}
    >
      {menuItems.map(
        (
          {
            type = MenuItemType.Normal,
            icon,
            title,
            isDisplayed = true,
            disabled,
            tooltip,
            context,
            action,
            customItemColor,
            'data-testid': dataTestId,
          },
          index,
        ) => {
          if (!isDisplayed) return null;
          const handleMenuItemClick = (event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            action?.({ title, context });
            onClose();
          };

          const TooltipWrapper = ({ children }: { children: JSX.Element }) =>
            tooltip ? (
              <Tooltip tooltipTitle={tooltip} placement="right">
                {children}
              </Tooltip>
            ) : (
              children
            );

          const menuItemContent = (
            <TooltipWrapper>
              <StyledMenuItemContent customItemColor={customItemColor}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                {!!title && (
                  <StyledBodyLarge
                    color={customItemColor || variables.palette.on_surface}
                    letterSpacing="xxl"
                    whiteSpace="pre-line"
                  >
                    {t(title)}
                  </StyledBodyLarge>
                )}
              </StyledMenuItemContent>
            </TooltipWrapper>
          );

          switch (type) {
            case MenuItemType.Normal:
            default:
              return (
                <MenuItem
                  key={index}
                  data-testid={dataTestId}
                  disabled={disabled}
                  onClick={disabled ? undefined : handleMenuItemClick}
                >
                  {menuItemContent}
                </MenuItem>
              );
            case MenuItemType.Info:
              return (
                <Box data-testid={dataTestId} key={index} sx={{ px: 1.6, py: 0.8 }}>
                  {menuItemContent}
                </Box>
              );
            case MenuItemType.Divider:
              return <Divider key={index} sx={{ flex: 1, my: 0.8 }} data-testid={dataTestId} />;
          }
        },
      )}
    </StyledMenu>
  );
};
