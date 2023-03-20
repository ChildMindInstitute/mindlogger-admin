import { Svg } from 'shared/components';
import {
  ExportDataSetting,
  DataRetention,
  EditAppletSetting,
  TransferOwnershipSetting,
  DuplicateAppletSettings,
  DeleteAppletSetting,
  ReportConfigSetting,
  ShareAppletSetting,
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
      },
      {
        icon: <Svg id="data-retention" />,
        label: 'dataRetention',
        component: <DataRetention />,
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
      },
      {
        icon: <Svg id="schema" />,
        label: 'downloadSchema',
        component: <DownloadSchemaSetting />,
      },
      {
        icon: <Svg id="version-history" />,
        label: 'versionHistory',
        component: <>versionHistory</>,
      },
      {
        icon: <Svg id="transfer-ownership" />,
        label: 'transferOwnership',
        component: <TransferOwnershipSetting />,
      },
      {
        icon: <Svg id="duplicate" />,
        label: 'duplicateApplet',
        component: <DuplicateAppletSettings />,
      },
      {
        icon: <Svg id="trash" />,
        label: 'deleteApplet',
        component: <DeleteAppletSetting />,
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
  //       component: <ShareAppletSetting />,
  //     },
  //   ],
  // },
];
