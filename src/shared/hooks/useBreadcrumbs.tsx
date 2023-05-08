import { useEffect } from 'react';
import { useLocation, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { auth, Breadcrumb, breadcrumbs, User, applet, users } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import {
  getEntityKey,
  checkCurrentActivityPage,
  checkCurrentActivityFlowPage,
  checkIfAppletActivityUrlPassed,
  checkIfAppletActivityFlowUrlPassed,
} from 'shared/utils';
import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { getRespondentLabel } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const { appletId, activityId, activityFlowId, respondentId } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const authData = auth.useData();
  const { secretId, nickname } = users.useRespondent(respondentId || '') || {};
  const respondentLabel = getRespondentLabel(secretId, nickname);
  const { firstName, lastName } = (authData?.user as User) || {};
  const { result: appletData } = applet.useAppletData() ?? {};
  const isNewApplet = useCheckIfNewApplet();
  const appletLabel = (isNewApplet ? t('newApplet') : appletData?.displayName) ?? '';
  const activityLabel =
    appletData?.activities?.find((activity) => getEntityKey(activity) === activityId)?.name ??
    t('newActivity') ??
    '';
  const activityFlowLabel =
    appletData?.activityFlows?.find((activityFlow) => getEntityKey(activityFlow) === activityFlowId)
      ?.name ??
    t('newActivityFlow') ??
    '';

  useEffect(() => {
    const newBreadcrumbs: Breadcrumb[] = [];
    const userName = `${firstName} ${lastName}`;
    const isDashboard = pathname.includes(page.dashboard);
    const isBuilder = pathname.includes(page.builder);
    const isLibrary = pathname.includes(page.library);

    if (firstName && isDashboard) {
      newBreadcrumbs.push({
        icon: 'home',
        label: t('userDashboard', { userName }),
        navPath: page.dashboard,
      });
    }
    if (firstName && isBuilder) {
      newBreadcrumbs.push({
        icon: 'builder',
        label: t('userBuilder', { userName }),
        navPath: page.builder,
      });
    }
    if (isLibrary) {
      newBreadcrumbs.push({
        icon: 'library',
        label: t('appletLibrary'),
        navPath: page.library,
      });
    }

    if (appletId && (isDashboard || isBuilder)) {
      newBreadcrumbs.push({
        icon: appletData?.image || '',
        label: appletData?.displayName || '',
        navPath: generatePath(isDashboard ? page.appletRespondents : page.builderApplet, {
          appletId,
        }),
        hasUrl: !!appletData?.image,
      });
    }

    if (pathname.includes('respondents')) {
      newBreadcrumbs.push({
        icon: 'respondent-outlined',
        label: t('respondents'),
        navPath: appletId
          ? generatePath(page.appletRespondents, { appletId })
          : page.dashboardRespondents,
      });
    }
    if (respondentId) {
      newBreadcrumbs.push({
        icon: 'account',
        label: respondentLabel,
        disabledLink: true,
      });
    }
    if (pathname.includes('dataviz')) {
      newBreadcrumbs.push({
        icon: '',
        label: t('viewData'),
        disabledLink: true,
      });
    }

    if (checkIfAppletActivityUrlPassed(pathname)) {
      const { isAbout, isItems, isItemsFlow, isActivitySettings } =
        checkCurrentActivityPage(pathname);

      newBreadcrumbs.push(
        {
          icon: 'checklist-outlined',
          label: t('activities'),
          navPath: generatePath(page.builderAppletActivities, { appletId, activityId }),
        },
        {
          icon: '',
          label: activityLabel,
          navPath: generatePath(page.builderAppletActivity, { appletId, activityId }),
        },
      );

      if (isAbout) newBreadcrumbs.push({ icon: 'more-info-outlined', label: t('aboutActivity') });
      if (isItems) newBreadcrumbs.push({ icon: 'item-outlined', label: t('items') });
      if (isItemsFlow) newBreadcrumbs.push({ icon: 'flow', label: t('itemFlow') });
      if (isActivitySettings)
        newBreadcrumbs.push({ icon: 'settings', label: t('activitySettings') });
    }

    if (checkIfAppletActivityFlowUrlPassed(pathname)) {
      const { isAbout, isBuilder } = checkCurrentActivityFlowPage(pathname);

      newBreadcrumbs.push(
        {
          icon: 'flow',
          label: t('activityFlow'),
          navPath: generatePath(page.builderAppletActivityFlow, {
            appletId,
          }),
        },
        {
          icon: '',
          label: activityFlowLabel,
          navPath: generatePath(page.builderAppletActivityFlowItem, { appletId, activityFlowId }),
        },
      );

      if (isAbout)
        newBreadcrumbs.push({
          icon: 'more-info-outlined',
          label: t('aboutActivityFlow'),
        });
      if (isBuilder)
        newBreadcrumbs.push({
          icon: 'flow',
          label: t('activityFlowBuilder'),
        });
    }

    const updatedBreadcrumbs = [...newBreadcrumbs, ...(restCrumbs || [])].map((crumb) => ({
      ...crumb,
      key: uniqueId(),
    }));
    dispatch(breadcrumbs.actions.setBreadcrumbs(updatedBreadcrumbs));
  }, [
    t,
    firstName,
    lastName,
    appletData,
    appletId,
    activityId,
    appletLabel,
    activityLabel,
    activityFlowLabel,
    pathname,
    dispatch,
    respondentLabel,
  ]);
};
