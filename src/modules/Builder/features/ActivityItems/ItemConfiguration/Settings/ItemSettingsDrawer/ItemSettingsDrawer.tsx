import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import {
  StyledTitleBoldSmall,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledFlexColumn,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { StyledDrawer, StyledDrawerContent } from './ItemSettingsDrawer.styles';
import { ItemSettingsDrawerProps } from './ItemSettingsDrawer.types';

export const ItemSettingsDrawer = ({ open, onClose, children }: ItemSettingsDrawerProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledDrawer
      open={open}
      anchor="right"
      hideBackdrop
      onClose={onClose}
      ModalProps={{
        container: () => document.querySelector('#simple-tabpanel-items'),
      }}
      transitionDuration={0}
    >
      <StyledDrawerContent>
        <StyledFlexTopCenter
          sx={{
            gap: '1.8rem',
            p: theme.spacing(0, 1.4),
          }}
        >
          <Svg id="report-configuration" />
          <StyledTitleBoldSmall sx={{ flexGrow: 1 }}>{t('settings')}</StyledTitleBoldSmall>
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={onClose}
          >
            <Svg id="cross" />
          </StyledClearedButton>
        </StyledFlexTopCenter>
        <StyledFlexColumn sx={{ overflowY: 'auto', gap: '2rem' }}>{children}</StyledFlexColumn>
      </StyledDrawerContent>
    </StyledDrawer>
  );
};
