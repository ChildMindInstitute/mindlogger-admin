import i18n from 'i18n';

import { SettingParam } from './urlGenerator';

const { t } = i18n;

export const getSettingBreadcrumbs = (param: SettingParam, isPublished = false) => {
  const settingBreadcrumbs = {
    [SettingParam.ExportData]: {
      icon: 'export',
      label: t('exportData'),
    },
    [SettingParam.DataRetention]: {
      icon: 'data-retention',
      label: t('dataRetention'),
    },
    [SettingParam.EditApplet]: {
      icon: 'edit-applet',
      label: t('editApplet'),
    },
    [SettingParam.DownloadSchema]: {
      icon: 'schema',
      label: t('downloadSchema'),
    },
    [SettingParam.VersionHistory]: {
      icon: 'version-history',
      label: t('versionHistory'),
    },
    [SettingParam.TransferOwnership]: {
      icon: 'transfer-ownership',
      label: t('transferOwnership'),
    },
    [SettingParam.DuplicateApplet]: {
      icon: 'duplicate',
      label: t('duplicateApplet'),
    },
    [SettingParam.DeleteApplet]: {
      icon: 'trash',
      label: t('deleteApplet'),
    },
    [SettingParam.ReportConfiguration]: {
      icon: 'configure',
      label: t('reportConfiguration'),
    },
    [SettingParam.ShareApplet]: {
      icon: 'share',
      label: t('shareToLibrary'),
    },
    [SettingParam.PublishConceal]: {
      icon: isPublished ? 'conceal' : 'publish',
      label: t(isPublished ? 'concealApplet' : 'publishApplet'),
    },
    [SettingParam.ScoresAndReports]: {
      icon: 'scores-and-reports',
      label: t('scoresAndReports'),
    },
    [SettingParam.SubscalesConfiguration]: {
      icon: 'grid-outlined',
      label: t('subscalesConfiguration'),
    },
    [SettingParam.LiveResponseStreaming]: {
      icon: 'live-response-streaming',
      label: t('liveResponseStreaming'),
    },
    [SettingParam.LorisIntegration]: {
      icon: 'data-collection',
      label: t('loris.integration'),
    },
  };

  return settingBreadcrumbs[param];
};
