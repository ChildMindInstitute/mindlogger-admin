import { useMemo } from 'react';
import { useLocation, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import uniqueId from 'lodash.uniqueid';

import { applet, workspaces, SingleApplet } from 'redux/modules';
import { page } from 'resources';
import { getSettingBreadcrumbs } from 'shared/utils/getSettingBreadcrumbs';
import { getEntityKey } from 'shared/utils/getEntityKey';
import {
  checkCurrentActivityPage,
  checkCurrentActivityFlowPage,
  checkIfAppletActivityUrlPassed,
  checkIfAppletActivityFlowUrlPassed,
  checkIfPerformanceTaskUrlPassed,
  checkCurrentPerformanceTaskPage,
  SettingParam,
  checkIfAppletSettingsUrlPassed,
  checkIfAppletUrlPassed,
  checkCurrentAppletPage,
} from 'shared/utils/urlGenerator';
import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { useRespondentLabel } from 'shared/hooks/useRespondentLabel';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { Breadcrumb } from './Breadcrumbs.types';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const {
    featureFlags: { enableMultiInformant },
  } = useFeatureFlags();
  const { appletId, activityId, activityFlowId, respondentId, subjectId, setting } = useParams();
  const { t } = useTranslation('app');
  const { pathname } = useLocation();

  const respondentLabel = useRespondentLabel({ hideNickname: !!enableMultiInformant });
  const subjectLabel = useRespondentLabel({
    hideNickname: !!enableMultiInformant,
    isSubject: true,
  });
  const { workspaceName } = workspaces.useData() ?? {};
  const { result } = applet.useAppletData() ?? {};
  const { getValues } = useFormContext() ?? {};
  const appletData = (getValues?.() ?? result) as SingleApplet;
  const isNewApplet = useCheckIfNewApplet();
  const appletLabel = (isNewApplet ? t('newApplet') : appletData?.displayName) ?? '';
  const currentActivity = result?.activities?.find(
    (activity) => getEntityKey(activity) === activityId,
  );
  const currentActivityName = currentActivity?.name;
  const activityLabel = currentActivity?.name ?? t('newActivity');
  const performanceTaskLabel =
    currentActivityName ??
    t(
      `performanceTasks.${Object.entries(checkCurrentPerformanceTaskPage(pathname)).find(
        ([, value]) => value,
      )?.[0]}`,
    );
  const activityFlowLabel =
    appletData?.activityFlows?.find((activityFlow) => getEntityKey(activityFlow) === activityFlowId)
      ?.name ?? t('newActivityFlow');

  return useMemo(() => {
    const activitiesBreadcrumb = {
      icon: 'checklist-outlined' as const,
      label: t('activities'),
      navPath:
        appletId && activityId
          ? generatePath(page.builderAppletActivities, { appletId, activityId })
          : '',
    };
    const newBreadcrumbs: Breadcrumb[] = [];
    const isDashboard = pathname.includes(page.dashboard);
    const isBuilder = pathname.includes(page.builder);
    const isLibrary = pathname.includes(page.library);

    if (workspaceName && isDashboard) {
      newBreadcrumbs.push({
        icon: 'home',
        label: t('userDashboard', { userName: workspaceName }),
        navPath: page.dashboard,
      });
    }
    if (workspaceName && isBuilder) {
      newBreadcrumbs.push({
        icon: 'dashboard',
        label: t('userDashboard', { userName: workspaceName }),
        navPath: page.dashboard,
      });
    }
    if (isLibrary) {
      newBreadcrumbs.push({
        icon: 'library',
        label: t('appletLibrary'),
        navPath: page.library,
      });

      if (pathname.includes('cart'))
        newBreadcrumbs.push({
          icon: 'cart-outlined',
          label: t('cart'),
        });
    }

    if (appletId && (isDashboard || isBuilder)) {
      const participantsPath = enableMultiInformant
        ? page.appletParticipants
        : page.appletRespondents;

      newBreadcrumbs.push({
        useCustomIcon: true,
        image: appletData?.image || '',
        label: appletLabel,
        chip: isBuilder ? t('editing') : undefined,
        navPath: generatePath(isDashboard ? participantsPath : page.builderApplet, {
          appletId,
        }),
      });
    }

    if (pathname.includes('applets')) {
      newBreadcrumbs.push({
        icon: 'applet-outlined',
        label: t('applets'),
        navPath: page.dashboardApplets,
      });
    }

    if (pathname.includes('managers') && !appletId) {
      newBreadcrumbs.push({
        icon: 'manager-outlined',
        label: t('managers'),
        navPath: page.dashboardManagers,
      });
    }

    if (pathname.includes('respondents') && !enableMultiInformant) {
      newBreadcrumbs.push({
        icon: 'respondent-outlined',
        label: t('respondents'),
        navPath: appletId
          ? generatePath(page.appletRespondents, { appletId })
          : page.dashboardRespondents,
      });
    }

    if (subjectId || respondentId) {
      newBreadcrumbs.push({
        icon: enableMultiInformant ? undefined : 'account',
        label: respondentLabel || subjectLabel,
        disabledLink: !currentActivity,
        navPath:
          enableMultiInformant && !!currentActivity
            ? generatePath(page.appletParticipantActivities, {
                appletId,
                subjectId: subjectId || respondentId,
              })
            : undefined,
      });
    }

    if (currentActivity && enableMultiInformant) {
      newBreadcrumbs.push({
        image: currentActivity?.image || '',
        label: currentActivity?.name ?? '',
        disabledLink: true,
      });
    }

    if (pathname.includes('dataviz')) {
      newBreadcrumbs.push({
        label: t('viewData'),
        disabledLink: true,
      });
    }

    if (pathname.includes('summary') && !enableMultiInformant) {
      newBreadcrumbs.push({
        icon: 'chart',
        label: t('summary'),
        disabledLink: true,
      });
    }

    if (pathname.includes('responses') && !enableMultiInformant) {
      newBreadcrumbs.push({
        icon: 'checkbox-outlined',
        label: t('responses'),
        disabledLink: true,
      });
    }
    if (pathname.includes('schedule') && !enableMultiInformant) {
      newBreadcrumbs.push({
        icon: 'schedule-outlined',
        label: t('schedule'),
        disabledLink: true,
      });
    }
    if (pathname.includes('add-user')) {
      newBreadcrumbs.push({
        icon: 'users-outlined',
        label: t('addUser'),
        disabledLink: true,
      });
    }

    if (checkIfAppletUrlPassed(pathname)) {
      const { isAbout, isActivityFlow, isActivities } = checkCurrentAppletPage(pathname);

      if (isAbout) {
        newBreadcrumbs.push({
          icon: 'more-info-outlined',
          label: t('aboutApplet'),
        });
      }
      if (isActivities && !activityId) {
        newBreadcrumbs.push({
          icon: 'checklist-filled',
          label: t('activities'),
        });
      }
      if (isActivityFlow && !activityFlowId) {
        newBreadcrumbs.push({
          icon: 'flow',
          label: t('activityFlows'),
        });
      }
    }
    if (checkIfAppletSettingsUrlPassed(pathname)) {
      newBreadcrumbs.push({
        icon: 'settings',
        label: t('appletSettings'),
        navPath: generatePath(isDashboard ? page.appletSettings : page.builderAppletSettings, {
          appletId,
        }),
      });
    }

    if (checkIfAppletActivityUrlPassed(pathname)) {
      const { isAbout, isItems, isItemsFlow, isActivitySettings } =
        checkCurrentActivityPage(pathname);

      newBreadcrumbs.push(activitiesBreadcrumb, {
        icon: 'checklist-outlined',
        label: activityLabel ?? '',
        navPath: generatePath(page.builderAppletActivity, { appletId, activityId }),
      });

      if (isAbout) newBreadcrumbs.push({ icon: 'more-info-outlined', label: t('aboutActivity') });
      if (isItems) newBreadcrumbs.push({ icon: 'item-outlined', label: t('items') });
      if (isItemsFlow) newBreadcrumbs.push({ icon: 'flow', label: t('itemFlow') });
      if (isActivitySettings)
        newBreadcrumbs.push({
          icon: 'settings',
          label: t('activitySettings'),
          navPath: generatePath(page.builderAppletActivitySettings, { appletId, activityId }),
        });
    }

    if (checkIfPerformanceTaskUrlPassed(pathname)) {
      newBreadcrumbs.push(
        activitiesBreadcrumb,
        {
          label: performanceTaskLabel || '',
          disabledLink: true,
        },
        {
          icon: 'configure',
          label: t('configure'),
        },
      );
    }

    if (checkIfAppletActivityFlowUrlPassed(pathname)) {
      const { isAbout, isBuilder, isSettings } = checkCurrentActivityFlowPage(pathname);

      newBreadcrumbs.push(
        {
          icon: 'flow',
          label: t('activityFlows'),
          navPath: generatePath(page.builderAppletActivityFlow, {
            appletId,
          }),
        },
        {
          label: activityFlowLabel ?? '',
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
      if (isSettings)
        newBreadcrumbs.push({
          icon: 'settings',
          label: t('activityFlowSettings'),
          navPath: generatePath(page.builderAppletActivityFlowItemSettings, {
            appletId,
            activityFlowId,
          }),
        });
    }

    if (setting)
      newBreadcrumbs.push(getSettingBreadcrumbs(setting as SettingParam, appletData?.isPublished));

    return [...newBreadcrumbs, ...(restCrumbs || [])].map((crumb) => ({
      ...crumb,
      key: uniqueId(),
    }));
  }, [
    t,
    workspaceName,
    appletData,
    appletId,
    activityId,
    appletLabel,
    activityLabel,
    activityFlowLabel,
    pathname,
    respondentLabel,
    activityFlowId,
    performanceTaskLabel,
    respondentId,
    restCrumbs,
    setting,
    subjectLabel,
  ]);
};
