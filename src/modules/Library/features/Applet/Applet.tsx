import { Fragment, useEffect, useMemo, useState } from 'react';

import { Box, Button } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { STORAGE_LIBRARY_KEY } from 'modules/Library/consts';
import { getSelectedAppletFromStorage, updateSelectedItemsInStorage } from 'modules/Library/utils';
import { auth, library } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { AppletImage, Svg } from 'shared/components';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledHeadline,
  StyledHeadlineLarge,
  StyledLabelBoldLarge,
  StyledTitleBoldMedium,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { falseReturnFunc, getDictionaryText, getHighlightedText, Mixpanel } from 'shared/utils';

import { Activity } from './Activity';
import { appletImageProps } from './Applet.const';
import {
  StyledActivities,
  StyledActivitiesContainer,
  StyledAppletContainer,
  StyledAppletKeyword,
  StyledAppletKeywordsContainer,
  StyledAppletName,
  StyledButtonsContainer,
  StyledExpandedButton,
  StyledSvgContainer,
} from './Applet.styles';
import { AppletProps, AppletUiType, LibraryForm } from './Applet.types';
import { getActivities, getUpdatedStorageData } from './Applet.utils';
import { RemoveAppletPopup } from './Popups';

export const Applet = ({
  applet,
  uiType = AppletUiType.List,
  search = '',
  setSearch,
  'data-testid': dataTestid,
}: AppletProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { result: cartItems } = library.useCartApplets() || {};
  const isAuthorized = auth.useAuthorized();

  const [activitiesVisible, setActivitiesVisible] = useState(uiType === AppletUiType.Details);
  const [removeAppletPopupVisible, setRemoveAppletPopupVisible] = useState(false);

  const { id, displayName, image = '', version = '', description, keywords, activities } = applet;

  const methods = useForm<LibraryForm>({ defaultValues: { [id]: [] }, mode: 'onChange' });
  const { getValues } = methods;

  const selectedItemsWithId = getValues();
  const selectedItems = selectedItemsWithId[id];
  const APPLET_DETAILS = `${page.library}/${id}`;
  const arrowSvgId = activitiesVisible ? 'navigate-up' : 'navigate-down';

  const handleRemove = () => {
    setRemoveAppletPopupVisible(true);
  };

  const handleAddToCart = () => {
    updateSelectedItemsInStorage(selectedItemsWithId, id);
    const updatedAppletsData = getUpdatedStorageData(cartItems, applet, id);

    if (isAuthorized) {
      dispatch(library.thunk.postAppletsToCart(updatedAppletsData));
    } else {
      sessionStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(updatedAppletsData));
      dispatch(library.actions.setAppletsFromStorage(updatedAppletsData));
    }

    Mixpanel.track('Add to Basket click');
  };

  const updatedActivities = useMemo(() => {
    if (!search) return activities;
    setActivitiesVisible(false);

    return getActivities(activities, search, setActivitiesVisible);
  }, [search, activities]);

  useEffect(() => {
    if (uiType === AppletUiType.Details) return;
    const selectedAppletItems = getSelectedAppletFromStorage(id);
    selectedAppletItems && setActivitiesVisible(true);
  }, [id]);

  const renderAppletInfoListView = () => (
    <>
      <StyledAppletName>
        <StyledTitleBoldMedium>{getHighlightedText(displayName, search)}</StyledTitleBoldMedium>
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
          sx={{ marginTop: theme.spacing(0.4), wordBreak: 'break-word' }}
        >
          {getHighlightedText(getDictionaryText(description), search)}
        </StyledBodyMedium>
      )}
    </>
  );

  const renderAppletInfoDetailsView = () => (
    <>
      <StyledHeadlineLarge>{displayName}</StyledHeadlineLarge>
      {version && <StyledLabelBoldLarge>{version}</StyledLabelBoldLarge>}
      {description && (
        <StyledBodyLarge sx={{ marginTop: theme.spacing(1.4), color: variables.palette.on_surface_variant }}>
          {getHighlightedText(getDictionaryText(description), search)}
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
            <Button variant="text" onClick={() => navigate(APPLET_DETAILS)} data-testid={`${dataTestid}-view-details`}>
              {t('viewDetails')}
            </Button>
            <Button
              disabled={!selectedItems?.length}
              variant="outlined"
              startIcon={<Svg width="18" height="18" id="cart-add" />}
              sx={{ ml: theme.spacing(1.2) }}
              onClick={handleAddToCart}
              data-testid={`${dataTestid}-add-to-cart`}
            >
              {t('addToCart')}
            </Button>
          </>
        );
      case AppletUiType.Details:
        return (
          <>
            <Button
              disabled={!selectedItems?.length}
              variant="contained"
              startIcon={<Svg width="18" height="18" id="cart-add" />}
              sx={{ ml: theme.spacing(1.2) }}
              onClick={handleAddToCart}
              data-testid={`${dataTestid}-add-to-cart`}
            >
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
              sx={{ ml: theme.spacing(1.2) }}
              onClick={handleRemove}
              data-testid={`${dataTestid}-cart-remove`}
            >
              {t('remove')}
            </Button>
          </>
        );
    }
  };

  return (
    <>
      <StyledAppletContainer data-testid={dataTestid} uiType={uiType}>
        <Box sx={{ gridArea: 'appletImage' }}>
          <AppletImage image={image} appletName={displayName} {...appletImageProps} />
        </Box>
        <Box>
          {renderAppletInfo()}
          {!!keywords.length && (
            <StyledAppletKeywordsContainer>
              {keywords.map((keyword, index) => (
                <StyledAppletKeyword
                  onClick={setSearch ? () => setSearch(keyword) : falseReturnFunc}
                  variant="contained"
                  key={keyword}
                  hasSearch={!!setSearch}
                  data-testid={`${dataTestid}-keywords-${index}`}
                >
                  {getHighlightedText(keyword, search)}
                </StyledAppletKeyword>
              ))}
            </StyledAppletKeywordsContainer>
          )}
        </Box>
        <StyledButtonsContainer>{renderButtons()}</StyledButtonsContainer>
        <FormProvider {...methods}>
          {updatedActivities?.length && (
            <StyledActivitiesContainer>
              {uiType === AppletUiType.Details ? (
                <StyledHeadline>{`${t('appletActivities')}:`}</StyledHeadline>
              ) : (
                <StyledExpandedButton
                  disableRipple
                  onClick={() => setActivitiesVisible((prevState) => !prevState)}
                  startIcon={
                    <StyledSvgContainer>
                      <Svg id={arrowSvgId} />
                    </StyledSvgContainer>
                  }
                  data-testid={`${dataTestid}-activities-collapse`}
                >
                  <StyledLabelBoldLarge>{t('activities')}</StyledLabelBoldLarge>
                </StyledExpandedButton>
              )}
              {activitiesVisible && (
                <StyledActivities>
                  {updatedActivities.map((activity, index) => (
                    <Fragment key={activity.name}>
                      <Activity
                        appletId={id}
                        activity={activity}
                        uiType={uiType}
                        search={search}
                        data-testid={`${dataTestid}-activities-${index}`}
                      />
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
          appletId={id}
          appletName={displayName}
          removeAppletPopupVisible={removeAppletPopupVisible}
          setRemoveAppletPopupVisible={setRemoveAppletPopupVisible}
          isAuthorized={isAuthorized}
          cartItems={cartItems}
          data-testid={`${dataTestid}-remove-popup`}
        />
      )}
    </>
  );
};
