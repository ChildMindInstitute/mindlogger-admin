import { useTranslation } from 'react-i18next';
import { Divider, ListItemIcon, MenuItem } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { StyledBodyLarge } from 'shared/styles/styledComponents';
import { Tooltip } from 'shared/components/Tooltip';

import { StyledMenu, StyledMenuItemContent } from './Menu.styles';
import { MenuProps } from './Menu.types';
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
            type = 'normal',
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
          const handleMenuItemClick = () => {
            action?.({ title, context });
            onClose();
          };
          const menuItemContent = (
            <StyledMenuItemContent customItemColor={customItemColor}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              {!!title && (
                <StyledBodyLarge
                  color={customItemColor || variables.palette.on_surface}
                  letterSpacing="xxl"
                >
                  {t(title)}
                </StyledBodyLarge>
              )}
            </StyledMenuItemContent>
          );

          return type === 'divider' ? (
            <Divider key={index} sx={{ flex: 1, my: 0.8 }} />
          ) : (
            <MenuItem
              key={index}
              disabled={disabled}
              onClick={disabled ? undefined : handleMenuItemClick}
              data-testid={dataTestId}
            >
              {tooltip ? (
                <Tooltip tooltipTitle={tooltip}>{menuItemContent}</Tooltip>
              ) : (
                menuItemContent
              )}
            </MenuItem>
          );
        },
      )}
    </StyledMenu>
  );
};
