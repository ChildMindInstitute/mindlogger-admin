import { Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import {
  DataRetention,
  TransferOwnershipSetting,
  // ShareAppletSetting,
  DownloadSchemaSetting,
  DeleteAppletSetting,
  ExportDataSetting,
  PublishConcealAppletSetting,
  VersionHistorySetting,
} from 'shared/features/AppletSettings';

import { GetSettings } from './BuilderAppletSettings.types';

export const getSettings = ({ isNewApplet, isPublished, role }: GetSettings) => [
  ...(role !== Roles.Editor
    ? [
        {
          label: 'usersAndData',
          items: [
            {
              icon: <Svg id="export" />,
              label: 'exportData',
              component: <ExportDataSetting isDisabled={isNewApplet} />,
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
        icon: <Svg id="schema" />,
        label: 'downloadSchema',
        component: <DownloadSchemaSetting isDisabled={isNewApplet} />,
        param: 'download-schema',
      },
      {
        icon: <Svg id="version-history" />,
        label: 'versionHistory',
        component: <VersionHistorySetting />,
        param: 'version-history',
      },
      ...(role === Roles.Owner
        ? [
            {
              icon: <Svg id="transfer-ownership" />,
              label: 'transferOwnership',
              component: <TransferOwnershipSetting isDisabled={isNewApplet} isApplet />,
              param: 'transfer-ownership',
            },
          ]
        : []),
      ...(role === Roles.Owner || role === Roles.Manager
        ? [
            {
              icon: <Svg id="trash" />,
              label: 'deleteApplet',
              component: <DeleteAppletSetting isDisabled={isNewApplet} />,
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
        component: <>Builder report configuration</>,
        param: 'report-configuration',
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
            // {
            //       icon: <Svg id="share" />,
            //       label: 'shareToLibrary',
            //       component: <ShareAppletSetting />,
            //     },
            {
              icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
              label: isPublished ? 'concealApplet' : 'publishApplet',
              component: <PublishConcealAppletSetting isBuilder />,
              param: 'publish-conceal',
            },
          ],
        },
      ]
    : []),
];
