import { Svg } from 'components/Svg';

import { EditAppletSetting } from '../EditAppletSetting';
import { ExportDataSetting } from '../ExportDataSetting';
import { DeleteAppletSetting } from '../DeleteAppletSetting';
import { DataRetention } from '../DataRetentionSetting/DataRetention';
import { ReportConfigSetting } from '../ReportConfigSetting';
import { ShareAppletSetting } from '../ShareAppletSetting';
import { TransferOwnershipSetting } from '../TransferOwnershipSetting';
import { DuplicateAppletSettings } from '../DuplicateAppletSettings';

export const navigationItems = [
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
        component: <>downloadSchema</>,
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
