import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Search, Svg } from 'shared/components';
import { theme, variables, StyledBodySmall, StyledLabelLarge } from 'shared/styles';
import { page } from 'resources';

import {
  StyledHeaderContainer,
  StyledBackButton,
  StyledBuilderButton,
  StyledCartButton,
} from './Header.styles';
import { HeaderProps, RightButtonType } from './Header.types';

export const Header = ({
  isBackButtonVisible = false,
  handleSearch,
  rightButtonType,
  rightButtonCallback,
}: HeaderProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const appletsCount = 0; // TODO: get the number of applets from the cart

  const handleNavigate = () => {
    navigate(page.library);
  };

  const renderCartButton = () => (
    <StyledCartButton
      startIcon={<Svg width="18" height="18" id="cart-filled" />}
      endIcon={<Svg width="20" height="20" id="navigate-right" />}
      variant="outlined"
      onClick={rightButtonCallback}
    >
      <Box sx={{ marginLeft: theme.spacing(1.2) }}>
        <StyledLabelLarge sx={{ textAlign: 'initial', color: variables.palette.on_surface }}>
          {t('cart')}
        </StyledLabelLarge>
        <StyledBodySmall sx={{ color: variables.palette.on_surface_variant }}>
          {appletsCount} {t('applet', { count: appletsCount })}
        </StyledBodySmall>
      </Box>
    </StyledCartButton>
  );

  const renderBuilderButton = () => (
    <StyledBuilderButton
      onClick={rightButtonCallback}
      startIcon={<Svg width="18" height="18" id="builder" />}
      variant="contained"
    >
      {t('addToBuilder')}
    </StyledBuilderButton>
  );

  return (
    <StyledHeaderContainer>
      <Box>
        {isBackButtonVisible && (
          <StyledBackButton
            startIcon={<Svg width="18" height="18" id="directory-up" />}
            onClick={handleNavigate}
          >
            <StyledLabelLarge> {t('appletsCatalog')}</StyledLabelLarge>
          </StyledBackButton>
        )}
      </Box>
      <Box sx={{ margin: theme.spacing(0, 1.6) }}>
        {handleSearch && <Search placeholder={t('search')} onSearch={handleSearch} width="100%" />}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {rightButtonType === RightButtonType.Cart ? renderCartButton() : renderBuilderButton()}
      </Box>
    </StyledHeaderContainer>
  );
};
