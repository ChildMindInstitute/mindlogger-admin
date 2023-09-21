import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import {
  ExportDataSetting,
  DataRetention,
  EditAppletSetting,
  TransferOwnershipSetting,
  DuplicateAppletSettings,
  DeleteAppletSetting,
  ReportConfigSetting,
  PublishConcealAppletSetting,
  VersionHistorySetting,
  ShareAppletSetting,
} from 'shared/features/AppletSettings';
import { SettingParam, isManagerOrOwner } from 'shared/utils';

import { GetSettings } from './DashboardAppletSettings.types';

export const getSettings = ({ isPublished, roles }: GetSettings) => {
  const dataTestid = 'dashboard-applet-settings';

  return [
    {
      label: 'usersAndData',
      isVisible: isManagerOrOwner(roles?.[0]),
      items: [
        {
          icon: <Svg id="export" />,
          label: 'exportData',
          component: <ExportDataSetting />,
          param: SettingParam.ExportData,
          'data-testid': `${dataTestid}-export-data`,
        },
        {
          icon: <Svg id="data-retention" />,
          label: 'dataRetention',
          component: <DataRetention isDashboard />,
          param: SettingParam.DataRetention,
          'data-testid': `${dataTestid}-data-retention`,
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
          param: SettingParam.EditApplet,
          'data-testid': `${dataTestid}-edit-applet`,
        },
        // Description: hid "Download Schema" logic until it will be used in future features
        // {
        //   icon: <Svg id="schema" />,
        //   label: 'downloadSchema',
        //   component: <DownloadSchemaSetting />,
        //   param: SettingParam.DownloadSchema,
        //   'data-testid': `${dataTestid}-download-schema`,
        // },
        {
          icon: <Svg id="version-history" />,
          label: 'versionHistory',
          component: <VersionHistorySetting />,
          param: SettingParam.VersionHistory,
          'data-testid': `${dataTestid}-version-history`,
        },
        {
          icon: <Svg id="transfer-ownership" />,
          label: 'transferOwnership',
          component: <TransferOwnershipSetting />,
          param: SettingParam.TransferOwnership,
          isVisible: roles?.[0] === Roles.Owner,
          'data-testid': `${dataTestid}-transfer-ownership`,
        },
        {
          icon: <Svg id="duplicate" />,
          label: 'duplicateApplet',
          component: <DuplicateAppletSettings />,
          param: SettingParam.DuplicateApplet,
          'data-testid': `${dataTestid}-duplicate-applet`,
        },
        {
          icon: <Svg id="trash" />,
          label: 'deleteApplet',
          component: <DeleteAppletSetting />,
          param: SettingParam.DeleteApplet,
          'data-testid': `${dataTestid}-remove-applet`,
        },
      ],
    },
    {
      label: 'reports',
      items: [
        {
          icon: <Svg id="configure" />,
          label: 'reportConfiguration',
          component: (
            <ReportConfigSetting isDashboard data-testid={`${dataTestid}-report-config-form`} />
          ),
          param: SettingParam.ReportConfiguration,
          'data-testid': `${dataTestid}-report-config`,
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
          param: SettingParam.ShareApplet,
          'data-testid': `${dataTestid}-share-to-library`,
        },

        {
          icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
          label: isPublished ? 'concealApplet' : 'publishApplet',
          component: <PublishConcealAppletSetting isDashboard />,
          param: SettingParam.PublishConceal,
          isVisible: roles?.includes(Roles.SuperAdmin),
          'data-testid': `${dataTestid}-publish-conceal`,
        },
      ],
    },
  ];
};
