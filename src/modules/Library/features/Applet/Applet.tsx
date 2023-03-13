import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledHeadlineLarge,
  StyledLabelBoldLarge,
  StyledTitleBoldMedium,
  StyledTitleMedium,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { Svg, AppletImage } from 'shared/components';
import { page } from 'resources';
import { variables } from 'shared/styles/variables';

import {
  StyledAppletContainer,
  StyledAppletName,
  StyledAppletKeywordsContainer,
  StyledAppletKeyword,
  StyledButtonsContainer,
} from './Applet.styles';
import { AppletProps, AppletUiType } from './Applet.types';
import { Activities } from './Activities';
import { RemoveAppletPopup } from './Popups';

export const Applet = ({
  applet: { appletId, name, image = '', version = '', description, keywords },
  uiType = AppletUiType.List,
}: AppletProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const [removeAppletPopupVisible, setRemoveAppletPopupVisible] = useState(false);

  const APPLET_DETAILS = `${page.library}/${appletId}`;

  const handleRemove = () => {
    setRemoveAppletPopupVisible(true);
  };

  const renderAppletInfoListView = () => (
    <>
      <StyledAppletName>
        <StyledTitleBoldMedium>{name}</StyledTitleBoldMedium>
        {version && (
          <>
            <StyledTitleMedium sx={{ margin: theme.spacing(0, 0.8) }}>∙</StyledTitleMedium>
            <StyledTitleMedium>{version}</StyledTitleMedium>
          </>
        )}
      </StyledAppletName>
      {description && (
        <StyledBodyMedium sx={{ marginTop: theme.spacing(0.4) }}>{description}</StyledBodyMedium>
      )}
    </>
  );

  const renderAppletInfoDetailsView = () => (
    <>
      <StyledHeadlineLarge>{name}</StyledHeadlineLarge>
      {version && <StyledLabelBoldLarge>{version}</StyledLabelBoldLarge>}
      {description && (
        <StyledBodyLarge
          sx={{ marginTop: theme.spacing(1.4), color: variables.palette.on_surface_variant }}
        >
          {description}
        </StyledBodyLarge>
      )}
    </>
  );

  const renderAppletInfo = () => {
    switch (uiType) {
      case AppletUiType.List:
      case AppletUiType.Cart:
        return renderAppletInfoListView();
      case AppletUiType.Details:
        return renderAppletInfoDetailsView();
    }
  };

  const renderButtons = () => {
    switch (uiType) {
      case AppletUiType.List:
        return (
          <>
            <Button variant="text" onClick={() => navigate(APPLET_DETAILS)}>
              {t('viewDetails')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Svg width="18" height="18" id="cart-add" />}
              sx={{ marginLeft: theme.spacing(1.2) }}
            >
              {/* TODO: fix button title - if the applet is in the table, then display 'remove' */}
              {t('addToCart')}
            </Button>
          </>
        );
      case AppletUiType.Details:
        return (
          <>
            <Button
              variant="contained"
              startIcon={<Svg width="18" height="18" id="cart-add" />}
              sx={{ marginLeft: theme.spacing(1.2) }}
            >
              {/* TODO: fix button title - if the applet is in the table, then display 'remove' */}
              {t('addToCart')}
            </Button>
          </>
        );
      case AppletUiType.Cart:
        return (
          <>
            <Button
              variant="outlined"
              startIcon={<Svg width="18" height="18" id="trash" />}
              sx={{ marginLeft: theme.spacing(1.2) }}
              onClick={handleRemove}
            >
              {t('remove')}
            </Button>
          </>
        );
    }
  };

  return (
    <>
      <StyledAppletContainer>
        <AppletImage image={image} name={name} />
        <Box>
          {renderAppletInfo()}
          {!!keywords.length && (
            <StyledAppletKeywordsContainer>
              {keywords.map((keyword) => (
                <StyledAppletKeyword key={keyword}>{keyword}</StyledAppletKeyword>
              ))}
            </StyledAppletKeywordsContainer>
          )}
        </Box>
        <StyledButtonsContainer>{renderButtons()}</StyledButtonsContainer>
        <Activities uiType={uiType} />
      </StyledAppletContainer>
      {removeAppletPopupVisible && (
        <RemoveAppletPopup
          appletId={appletId}
          appletName={name}
          removeAppletPopupVisible={removeAppletPopupVisible}
          setRemoveAppletPopupVisible={setRemoveAppletPopupVisible}
        />
      )}
    </>
  );
};
