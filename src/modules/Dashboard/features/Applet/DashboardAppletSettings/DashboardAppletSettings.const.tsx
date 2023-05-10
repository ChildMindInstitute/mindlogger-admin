import { Svg } from 'shared/components';
import {
  ExportDataSetting,
  DataRetention,
  EditAppletSetting,
  TransferOwnershipSetting,
  DuplicateAppletSettings,
  DeleteAppletSetting,
  ReportConfigSetting,
  DownloadSchemaSetting,
} from 'shared/features/AppletSettings';

export const settings = [
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
        component: <>versionHistory</>,
        param: 'version-history',
      },
      {
        icon: <Svg id="transfer-ownership" />,
        label: 'transferOwnership',
        component: <TransferOwnershipSetting isApplet />,
        param: 'transfer-ownership',
      },
      {
        icon: <Svg id="duplicate" />,
        label: 'duplicateApplet',
        component: <DuplicateAppletSettings />,
        param: 'duplicate-applet',
      },
      {
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
        icon: <Svg id="report-configuration" />,
        label: 'reportConfiguration',
        component: <ReportConfigSetting />,
        param: 'report-configuration',
      },
    ],
  },
  // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
  // introduced. (Story: AUS-4.1.4.10)
  // {
  //   label: 'sharing',
  //   items: [
  //     {
  //       icon: <Svg id="share" />,
  //       label: 'shareToLibrary',
  //       component: <ShareAppletSetting />,
  //     },
  //   ],
  // },
];
