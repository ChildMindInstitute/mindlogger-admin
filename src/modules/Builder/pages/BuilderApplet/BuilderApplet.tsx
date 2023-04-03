import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SaveAndPublish } from 'modules/Builder/features';
import { SaveChangesPopup } from 'modules/Builder/components';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { isNewApplet } from 'shared/utils';
import { applet } from 'shared/state';
import { Applet } from 'shared/types';

import { newAppletTabs } from './BuilderApplet.const';
import { usePrompt } from './BuilderApplet.hooks';
import { AppletSchema } from './BuilderApplet.schema';
import { getNewApplet } from './BuilderApplet.utils';

export const BuilderApplet = () => {
  const { t } = useTranslation();
  const params = useParams();
  const hiddenHeader = !!params.activityId;
  const dispatch = useAppDispatch();
  const { cancelNavigation, confirmNavigation, promptVisible } = usePrompt();
  const { appletId } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletLabel = (isNewApplet(appletId) ? t('newApplet') : appletData?.displayName) ?? '';

  const methods = useForm<Applet>({
    defaultValues: getNewApplet(),
    resolver: yupResolver(AppletSchema()),
    mode: 'onChange',
  });

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: appletLabel,
      disabledLink: true,
    },
  ]);

  useEffect(() => {
    if (!appletId || isNewApplet(appletId)) return;

    const { getApplet } = applet.thunk;
    dispatch(getApplet({ appletId }));
  }, [appletId]);

  return (
    <FormProvider {...methods}>
      <StyledBody sx={{ position: 'relative' }}>
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={newAppletTabs} />
        <SaveAndPublish />
      </StyledBody>
      <SaveChangesPopup
        isPopupVisible={promptVisible}
        handleClose={cancelNavigation}
        handleSubmit={confirmNavigation}
      />
    </FormProvider>
  );
};
