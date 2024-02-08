import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { theme, StyledTitleBoldSmall, StyledClearedButton, StyledFlexTopCenter } from 'shared/styles';

import { StyledDrawer, StyledDrawerContent, StyledSettings } from './ItemSettingsDrawer.styles';
import { ItemSettingsDrawerProps } from './ItemSettingsDrawer.types';

export const ItemSettingsDrawer = ({ open, onClose, children }: ItemSettingsDrawerProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledDrawer
      open={open}
      anchor="right"
      onClose={onClose}
      ModalProps={{
        container: () => document.querySelector('#simple-tabpanel-items'),
      }}
      transitionDuration={0}
      data-testid="builder-activity-items-item-configuration-settings-drawer">
      <StyledDrawerContent>
        <StyledFlexTopCenter
          sx={{
            gap: '1.8rem',
            p: theme.spacing(0, 1.4),
          }}>
          <Svg id="configure" />
          <StyledTitleBoldSmall sx={{ flexGrow: 1 }}>{t('settings')}</StyledTitleBoldSmall>
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={onClose}
            data-testid="builder-activity-items-item-settings-close">
            <Svg id="cross" />
          </StyledClearedButton>
        </StyledFlexTopCenter>
        <StyledSettings sx={{ overflowY: 'auto', gap: '0.6rem' }}>{children}</StyledSettings>
      </StyledDrawerContent>
    </StyledDrawer>
  );
};
