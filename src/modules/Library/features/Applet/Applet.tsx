import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Svg } from 'shared/components';
import {
  theme,
  variables,
  StyledBodyLarge,
  StyledBodyMedium,
  StyledHeadline,
  StyledHeadlineLarge,
  StyledLabelBoldLarge,
  StyledTitleBoldMedium,
  StyledTitleMedium,
} from 'shared/styles';
import { page } from 'resources';

import {
  StyledAppletContainer,
  StyledAppletName,
  StyledAppletKeywordsContainer,
  StyledAppletKeyword,
  StyledButtonsContainer,
  StyledActivitiesContainer,
  StyledExpandedButton,
  StyledActivities,
  StyledSvgContainer,
} from './Applet.styles';
import { AppletForm, AppletProps, AppletUiType } from './Applet.types';
import { RemoveAppletPopup } from './Popups';
import { Activity } from './Activity';
import { AppletImage } from './AppletImage';

export const Applet = ({
  applet: { appletId, name, image = '', version = '', description, keywords, activities },
  uiType = AppletUiType.List,
}: AppletProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const [activitiesVisible, setActivitiesVisible] = useState(uiType === AppletUiType.Details);
  const [removeAppletPopupVisible, setRemoveAppletPopupVisible] = useState(false);

  const methods = useForm<AppletForm>({ defaultValues: { [appletId]: [] }, mode: 'onChange' });
  const { getValues } = methods;

  const selectedItems = getValues()[appletId];
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
        <StyledBodyMedium
          color={variables.palette.on_surface}
          sx={{ marginTop: theme.spacing(0.4) }}
        >
          {description}
        </StyledBodyMedium>
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
              disabled={!selectedItems.length}
              variant="outlined"
              startIcon={<Svg width="18" height="18" id="cart-add" />}
              sx={{ marginLeft: theme.spacing(1.2) }}
              onClick={() => console.log(getValues())}
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
              disabled={!selectedItems.length}
              variant="contained"
              startIcon={<Svg width="18" height="18" id="cart-add" />}
              sx={{ marginLeft: theme.spacing(1.2) }}
              onClick={() => console.log(getValues())}
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
        <FormProvider {...methods}>
          {activities?.length && (
            <StyledActivitiesContainer uiType={uiType}>
              {uiType === AppletUiType.Details ? (
                <StyledHeadline>{`${t('appletActivities')}:`}</StyledHeadline>
              ) : (
                <StyledExpandedButton
                  disableRipple
                  onClick={() => setActivitiesVisible((prevState) => !prevState)}
                  startIcon={
                    <StyledSvgContainer>
                      <Svg id={activitiesVisible ? 'navigate-up' : 'navigate-down'} />
                    </StyledSvgContainer>
                  }
                >
                  <StyledLabelBoldLarge>{t('activities')}</StyledLabelBoldLarge>
                </StyledExpandedButton>
              )}
              {activitiesVisible && (
                <StyledActivities>
                  {activities.map((activity) => (
                    <Fragment key={activity.id}>
                      <Activity appletId={appletId} activity={activity} />
                    </Fragment>
                  ))}
                </StyledActivities>
              )}
            </StyledActivitiesContainer>
          )}
        </FormProvider>
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
