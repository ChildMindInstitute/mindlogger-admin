import { Svg } from 'components/Svg';

export const navigationItems = [
  {
    label: 'usersAndData',
    items: [
      {
        icon: <Svg id="export" />,
        label: 'exportData',
        component: <>exportData</>,
      },
      {
        icon: <Svg id="data-retention" />,
        label: 'dataRetention',
        component: <>dataRetention</>,
      },
    ],
  },
  {
    label: 'appletContent',
    items: [
      {
        icon: <Svg id="edit-applet" />,
        label: 'editApplet',
        component: <>editApplet</>,
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
        component: <>shareToLibrary</>,
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
        component: <>deleteApplet</>,
      },
    ],
  },
];
