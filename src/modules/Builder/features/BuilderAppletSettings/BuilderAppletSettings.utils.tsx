import i18n from 'i18n';
import { Svg } from 'shared/components';
import { REPORT_CONFIG_PARAM, Roles } from 'shared/consts';
import {
  DataRetention,
  TransferOwnershipSetting,
  ShareAppletSetting,
  DownloadSchemaSetting,
  DeleteAppletSetting,
  ExportDataSetting,
  PublishConcealAppletSetting,
  ReportConfigSetting,
  VersionHistorySetting,
} from 'shared/features/AppletSettings';
import { isManagerOrOwner } from 'shared/utils';

import { GetSettings } from './BuilderAppletSettings.types';

export const getSettings = ({
  isNewApplet,
  isPublished,
  roles,
  onReportConfigSubmit,
}: GetSettings) => {
  const { t } = i18n;

  const tooltip = isNewApplet ? t('saveAndPublishFirst') : undefined;

  return [
    ...(isManagerOrOwner(roles?.[0])
      ? [
          {
            label: 'usersAndData',
            items: [
              {
                name: 'exportData',
                icon: <Svg id="export" />,
                label: t('exportData'),
                component: <ExportDataSetting />,
                param: 'export-data',
                disabled: isNewApplet,
                tooltip,
              },
              {
                name: 'dataRetention',
                icon: <Svg id="data-retention" />,
                label: t('dataRetention'),
                component: <DataRetention />,
                param: 'data-retention',
                disabled: isNewApplet,
                tooltip,
              },
            ],
          },
        ]
      : []),
    {
      label: 'appletContent',
      items: [
        {
          name: 'downloadSchema',
          icon: <Svg id="schema" />,
          label: t('downloadSchema'),
          component: <DownloadSchemaSetting />,
          param: 'download-schema',
          disabled: isNewApplet,
          tooltip,
        },
        {
          name: 'versionHistory',
          icon: <Svg id="version-history" />,
          label: t('versionHistory'),
          component: <VersionHistorySetting />,
          param: 'version-history',
          disabled: isNewApplet,
          tooltip,
        },
        ...(roles?.[0] === Roles.Owner
          ? [
              {
                name: 'transferOwnership',
                icon: <Svg id="transfer-ownership" />,
                label: t('transferOwnership'),
                component: <TransferOwnershipSetting />,
                param: 'transfer-ownership',
                disabled: isNewApplet,
                tooltip,
              },
            ]
          : []),
        ...(isManagerOrOwner(roles?.[0])
          ? [
              {
                name: 'deleteApplet',
                icon: <Svg id="trash" />,
                label: t('deleteApplet'),
                component: <DeleteAppletSetting />,
                param: 'delete-applet',
                disabled: isNewApplet,
                tooltip,
              },
            ]
          : []),
      ],
    },
    {
      label: 'reports',
      items: [
        {
          name: 'reportConfiguration',
          icon: <Svg id="report-configuration" />,
          label: t('reportConfiguration'),
          component: <ReportConfigSetting onSubmitSuccess={onReportConfigSubmit} />,
          param: REPORT_CONFIG_PARAM,
          disabled: isNewApplet,
          tooltip,
        },
      ],
    },
    ...(!isNewApplet
      ? [
          {
            label: 'sharing',
            items: [
              // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
              // introduced. (Story: AUS-4.1.4.10)
              // Temporarily unhided for testing purposes
              {
                name: 'shareToLibrary',
                icon: <Svg id="share" />,
                label: t('shareToLibrary'),
                component: <ShareAppletSetting />,
                param: 'share-applet',
              },
              ...(roles?.includes(Roles.SuperAdmin)
                ? [
                    {
                      name: isPublished ? 'concealApplet' : 'publishApplet',
                      icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
                      label: isPublished ? t('concealApplet') : t('publishApplet'),
                      component: <PublishConcealAppletSetting isBuilder />,
                      param: 'publish-conceal',
                      disabled: isNewApplet,
                      tooltip,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),
  ];
};
