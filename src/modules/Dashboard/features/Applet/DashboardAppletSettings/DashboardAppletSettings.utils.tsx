import { Svg } from 'shared/components';
import { REPORT_CONFIG_PARAM, Roles } from 'shared/consts';
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
import { isManagerOrOwner } from 'shared/utils';

import { GetSettings } from './DashboardAppletSettings.types';

export const getSettings = ({ isPublished, roles }: GetSettings) => [
  ...(isManagerOrOwner(roles?.[0])
    ? [
        {
          label: 'usersAndData',
          items: [
            {
              name: 'exportData',
              icon: <Svg id="export" />,
              label: 'exportData',
              component: <ExportDataSetting />,
              param: 'export-data',
            },
            {
              name: 'dataRetention',
              icon: <Svg id="data-retention" />,
              label: 'dataRetention',
              component: <DataRetention isDashboard />,
              param: 'data-retention',
            },
          ],
        },
      ]
    : []),
  {
    label: 'appletContent',
    items: [
      {
        name: 'editApplet',
        icon: <Svg id="edit-applet" />,
        label: 'editApplet',
        component: <EditAppletSetting />,
        param: 'edit-applet',
      },
      {
        name: 'downloadSchema',
        icon: <Svg id="schema" />,
        label: 'downloadSchema',
        component: <DownloadSchemaSetting />,
        param: 'download-schema',
      },
      {
        name: 'versionHistory',
        icon: <Svg id="version-history" />,
        label: 'versionHistory',
        component: <VersionHistorySetting />,
        param: 'version-history',
      },
      ...(roles?.[0] === Roles.Owner
        ? [
            {
              name: 'transferOwnership',
              icon: <Svg id="transfer-ownership" />,
              label: 'transferOwnership',
              component: <TransferOwnershipSetting />,
              param: 'transfer-ownership',
            },
          ]
        : []),
      {
        name: 'duplicateApplet',
        icon: <Svg id="duplicate" />,
        label: 'duplicateApplet',
        component: <DuplicateAppletSettings />,
        param: 'duplicate-applet',
      },

      {
        name: 'deleteApplet',
        icon: <Svg id="trash" />,
        label: 'deleteApplet',
        component: <DeleteAppletSetting />,
        param: 'delete-applet',
      },
    ],
  },
  {
    label: 'reports',
    items: [
      {
        name: 'reportConfiguration',
        icon: <Svg id="report-configuration" />,
        label: 'reportConfiguration',
        component: <ReportConfigSetting isDashboard />,
        param: REPORT_CONFIG_PARAM,
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
        name: 'shareToLibrary',
        icon: <Svg id="share" />,
        label: 'shareToLibrary',
        component: <ShareAppletSetting />,
        param: 'share-applet',
      },
      ...(roles?.includes(Roles.SuperAdmin)
        ? [
            {
              name: isPublished ? 'concealApplet' : 'publishApplet',
              icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
              label: isPublished ? 'concealApplet' : 'publishApplet',
              component: <PublishConcealAppletSetting isDashboard />,
              param: 'publish-conceal',
            },
          ]
        : []),
    ],
  },
];
