import { Svg } from 'shared/components';
import {
  DataRetention,
  TransferOwnershipSetting,
  // ShareAppletSetting,
  DownloadSchemaSetting,
  DeleteAppletSetting,
  ExportDataSetting,
} from 'shared/features/AppletSettings';

export const getSettings = (isEditAppletPage: boolean) => [
  {
    label: 'usersAndData',
    items: [
      {
        icon: <Svg id="export" />,
        label: 'exportData',
        component: <ExportDataSetting isDisabled={isEditAppletPage} />,
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
  {
    label: 'appletContent',
    items: [
      {
        icon: <Svg id="schema" />,
        label: 'downloadSchema',
        component: <DownloadSchemaSetting isDisabled={isEditAppletPage} />,
        param: 'download-schema',
      },
      {
        icon: <Svg id="version-history" />,
        label: 'versionHistory',
        component: <>versionHistory</>, //TODO: Add isDisabled,
        param: 'version-history',
      },
      {
        icon: <Svg id="transfer-ownership" />,
        label: 'transferOwnership',
        component: <TransferOwnershipSetting isDisabled={isEditAppletPage} />,
        param: 'transfer-ownership',
      },
      {
        icon: <Svg id="trash" />,
        label: 'deleteApplet',
        component: <DeleteAppletSetting isDisabled={isEditAppletPage} />,
        param: 'delete-applet',
      },
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
  // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is introduced.
  // {
  //   label: 'sharing',
  //   items: [
  //     {
  //       icon: <Svg id="share" />,
  //       label: 'shareToLibrary',
  //       component: <ShareAppletSetting isDisabled={isEditAppletPage} />,
  //     },
  //   ],
  // },
];
