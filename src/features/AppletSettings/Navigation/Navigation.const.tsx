import { Svg } from 'components/Svg';
import { EditApplet } from 'features/EditApplet';
import { ExportData } from 'features/ExportData';
import { DeleteApplet } from 'features/DeleteApplet';

import { DataRetention } from '../DataRetentionSetting/DataRetention';
import { ShareAppletSetting } from '../ShareAppletSetting';

export const navigationItems = [
  {
    label: 'usersAndData',
    items: [
      {
        icon: <Svg id="export" />,
        label: 'exportData',
        component: <ExportData />,
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
        component: <EditApplet />,
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
    ],
  },
  {
    label: 'reports',
    items: [
      {
        icon: <Svg id="report-configuration" />,
        label: 'reportConfiguration',
        component: <>reportConfiguration</>,
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
  {
    label: 'transferDelete',
    items: [
      {
        icon: <Svg id="transfer-ownership" />,
        label: 'transferOwnership',
        component: <>transferOwnership</>,
      },
      {
        icon: <Svg id="trash" />,
        label: 'deleteApplet',
        component: <DeleteApplet />,
      },
    ],
  },
];
