import { Svg } from 'components';
import {
  DataRetention,
  TransferOwnershipSetting,
  ShareAppletSetting,
  DownloadSchemaSetting,
  DeleteAppletSetting,
  ExportDataSetting,
} from 'features/AppletSettings';

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
        component: <>Builder report configuration</>,
      },
    ],
  },
  {
    label: 'sharing',
    items: [
      {
        icon: <Svg id="share" />,
        label: 'shareToLibrary',
        component: <ShareAppletSetting />,
      },
    ],
  },
];
