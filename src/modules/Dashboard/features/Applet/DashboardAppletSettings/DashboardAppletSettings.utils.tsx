import { Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import {
  ExportDataSetting,
  DataRetention,
  EditAppletSetting,
  TransferOwnershipSetting,
  DuplicateAppletSettings,
  DeleteAppletSetting,
  ReportConfigSetting,
  DownloadSchemaSetting,
  PublishConcealAppletSetting,
  VersionHistorySetting,
  ShareAppletSetting,
} from 'shared/features/AppletSettings';
import { SettingParam, isManagerOrOwner } from 'shared/utils';

import { GetSettings } from './DashboardAppletSettings.types';

export const getSettings = ({ isPublished, roles }: GetSettings) => {
  const dataTestid = 'dashboard-applet-settings';

  return [
    ...(isManagerOrOwner(roles?.[0])
      ? [
          {
            label: 'usersAndData',
            items: [
              {
                icon: <Svg id="export" />,
                label: 'exportData',
                component: <ExportDataSetting />,
                param: SettingParam.ExportData,
                'data-testid': `${dataTestid}-export-data`,
              },
              {
                icon: <Svg id="data-retention" />,
                label: 'dataRetention',
                component: <DataRetention isDashboard />,
                param: SettingParam.DataRetention,
                'data-testid': `${dataTestid}-data-retention`,
              },
            ],
          },
        ]
      : []),
    {
      label: 'appletContent',
      items: [
        {
          icon: <Svg id="edit-applet" />,
          label: 'editApplet',
          component: <EditAppletSetting />,
          param: SettingParam.EditApplet,
          'data-testid': `${dataTestid}-edit-applet`,
        },
        {
          icon: <Svg id="schema" />,
          label: 'downloadSchema',
          component: <DownloadSchemaSetting />,
          param: SettingParam.DownloadSchema,
          'data-testid': `${dataTestid}-download-schema`,
        },
        {
          icon: <Svg id="version-history" />,
          label: 'versionHistory',
          component: <VersionHistorySetting />,
          param: SettingParam.VersionHistory,
          'data-testid': `${dataTestid}-version-history`,
        },
        ...(roles?.[0] === Roles.Owner
          ? [
              {
                icon: <Svg id="transfer-ownership" />,
                label: 'transferOwnership',
                component: <TransferOwnershipSetting />,
                param: SettingParam.TransferOwnership,
                'data-testid': `${dataTestid}-transfer-ownership`,
              },
            ]
          : []),
        {
          icon: <Svg id="duplicate" />,
          label: 'duplicateApplet',
          component: <DuplicateAppletSettings />,
          param: SettingParam.DuplicateApplet,
          'data-testid': `${dataTestid}-duplicate-applet`,
        },

        {
          icon: <Svg id="trash" />,
          label: 'deleteApplet',
          component: <DeleteAppletSetting />,
          param: SettingParam.DeleteApplet,
          'data-testid': `${dataTestid}-remove-applet`,
        },
      ],
    },
    {
      label: 'reports',
      items: [
        {
          icon: <Svg id="report-configuration" />,
          label: 'reportConfiguration',
          component: (
            <ReportConfigSetting isDashboard data-testid={`${dataTestid}-report-config-form`} />
          ),
          param: SettingParam.ReportConfiguration,
          'data-testid': `${dataTestid}-report-config`,
        },
      ],
    },
    {
      label: 'sharing',
      items: [
        // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
        // introduced. (Story: AUS-4.1.4.10)
        // Temporarily unhided for testing purposes
        {
          icon: <Svg id="share" />,
          label: 'shareToLibrary',
          component: <ShareAppletSetting />,
          param: SettingParam.ShareApplet,
          'data-testid': `${dataTestid}-share-to-library`,
        },
        ...(roles?.includes(Roles.SuperAdmin)
          ? [
              {
                icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
                label: isPublished ? 'concealApplet' : 'publishApplet',
                component: <PublishConcealAppletSetting isDashboard />,
                param: SettingParam.PublishConceal,
                'data-testid': `${dataTestid}-publish-conceal`,
              },
            ]
          : []),
      ],
    },
  ];
};
