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
              icon: <Svg id="export" />,
              label: 'exportData',
              component: <ExportDataSetting />,
              param: 'export-data',
            },
            {
              icon: <Svg id="data-retention" />,
              label: 'dataRetention',
              component: <DataRetention />,
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
        icon: <Svg id="edit-applet" />,
        label: 'editApplet',
        component: <EditAppletSetting />,
        param: 'edit-applet',
      },
      {
        icon: <Svg id="schema" />,
        label: 'downloadSchema',
        component: <DownloadSchemaSetting />,
        param: 'download-schema',
      },
      {
        icon: <Svg id="version-history" />,
        label: 'versionHistory',
        component: <VersionHistorySetting />,
        param: 'version-history',
      },
      ...(roles?.[0] === Roles.Owner
        ? [
            {
              icon: <Svg id="transfer-ownership" />,
              label: 'transferOwnership',
              component: <TransferOwnershipSetting />,
              param: 'transfer-ownership',
            },
          ]
        : []),
      {
        icon: <Svg id="duplicate" />,
        label: 'duplicateApplet',
        component: <DuplicateAppletSettings />,
        param: 'duplicate-applet',
      },
      ...(isManagerOrOwner(roles?.[0])
        ? [
            {
              icon: <Svg id="trash" />,
              label: 'deleteApplet',
              component: <DeleteAppletSetting />,
              param: 'delete-applet',
            },
          ]
        : []),
    ],
  },
  {
    label: 'reports',
    items: [
      {
        icon: <Svg id="report-configuration" />,
        label: 'reportConfiguration',
        component: <ReportConfigSetting isDashboard />,
        param: 'report-configuration',
      },
    ],
  },
  ...(roles?.includes(Roles.SuperAdmin)
    ? [
        {
          label: 'sharing',
          items: [
            // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
            // introduced. (Story: AUS-4.1.4.10)
            // {
            //       icon: <Svg id="share" />,
            //       label: 'shareToLibrary',
            //       component: <ShareAppletSetting />,
            //     },
            {
              icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
              label: isPublished ? 'concealApplet' : 'publishApplet',
              component: <PublishConcealAppletSetting isDashboard />,
              param: 'publish-conceal',
            },
          ],
        },
      ]
    : []),
];
