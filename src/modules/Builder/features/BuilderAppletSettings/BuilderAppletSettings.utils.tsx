import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import {
  DataRetention,
  TransferOwnershipSetting,
  // ShareAppletSetting,
  DeleteAppletSetting,
  ExportDataSetting,
  PublishConcealAppletSetting,
  ReportConfigSetting,
  VersionHistorySetting,
  LiveResponseStreamingSetting,
} from 'shared/features/AppletSettings';
import { SettingParam, isManagerOrOwner } from 'shared/utils';

import { GetSettings } from './BuilderAppletSettings.types';

export const getSettings = ({
  isNewApplet,
  isPublished,
  roles,
  onReportConfigSubmit,
}: GetSettings) => {
  const tooltip = isNewApplet ? 'saveAndPublishFirst' : undefined;
  const dataTestid = 'builder-applet-settings';

  return [
    {
      label: 'usersAndData',
      items: [
        {
          icon: <Svg id="export" />,
          label: 'exportData',
          component: <ExportDataSetting />,
          param: SettingParam.ExportData,
          disabled: isNewApplet,
          tooltip,
          isVisible: isManagerOrOwner(roles?.[0]),
          'data-testid': `${dataTestid}-export-data`,
        },
        {
          icon: <Svg id="data-retention" />,
          label: 'dataRetention',
          component: <DataRetention />,
          param: SettingParam.DataRetention,
          disabled: isNewApplet,
          tooltip,
          isVisible: isManagerOrOwner(roles?.[0]),
          'data-testid': `${dataTestid}-data-retention`,
        },
        {
          icon: <Svg id="live-response-streaming" />,
          label: 'liveResponseStreaming',
          component: <LiveResponseStreamingSetting />,
          param: SettingParam.LiveResponseStreaming,
          'data-testid': `${dataTestid}-live-response-streaming`,
        },
      ],
    },
    {
      label: 'appletContent',
      items: [
        // Description: hid "Download Schema" logic until it will be used in future features
        // {
        //   icon: <Svg id="schema" />,
        //   label: 'downloadSchema',
        //   component: <DownloadSchemaSetting />,
        //   param: SettingParam.DownloadSchema,
        //   disabled: isNewApplet,
        //   tooltip,
        //   'data-testid': `${dataTestid}-download-schema`,
        // },
        {
          icon: <Svg id="version-history" />,
          label: 'versionHistory',
          component: <VersionHistorySetting />,
          param: SettingParam.VersionHistory,
          disabled: isNewApplet,
          tooltip,
          'data-testid': `${dataTestid}-version-history`,
        },
        {
          icon: <Svg id="transfer-ownership" />,
          label: 'transferOwnership',
          component: <TransferOwnershipSetting />,
          param: SettingParam.TransferOwnership,
          disabled: isNewApplet,
          tooltip,
          isVisible: roles?.[0] === Roles.Owner,
          'data-testid': `${dataTestid}-transfer-ownership`,
        },
        {
          icon: <Svg id="trash" />,
          label: 'deleteApplet',
          component: <DeleteAppletSetting />,
          param: SettingParam.DeleteApplet,
          disabled: isNewApplet,
          tooltip,
          isVisible: isManagerOrOwner(roles?.[0]),
          'data-testid': `${dataTestid}-delete-applet`,
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
            <ReportConfigSetting
              onSubmitSuccess={onReportConfigSubmit}
              data-testid={`${dataTestid}-report-config-form`}
            />
          ),
          param: SettingParam.ReportConfiguration,
          disabled: isNewApplet,
          tooltip,
          'data-testid': `${dataTestid}-report-config`,
        },
      ],
    },

    {
      label: 'sharing',
      //remove roles?.includes(Roles.SuperAdmin) check after uncommenting Share to Library functionality
      isVisible: !isNewApplet && roles?.includes(Roles.SuperAdmin),
      items: [
        // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
        // introduced. (Story: AUS-4.1.4.10).
        // {
        //   icon: <Svg id="share" />,
        //   label: 'shareToLibrary',
        //   component: <ShareAppletSetting />,
        //   param: SettingParam.ShareApplet,
        //   'data-testid': `${dataTestid}-share-to-library`,
        // },
        {
          icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
          label: isPublished ? 'concealApplet' : 'publishApplet',
          component: <PublishConcealAppletSetting isBuilder />,
          param: SettingParam.PublishConceal,
          disabled: isNewApplet,
          tooltip,
          isVisible: roles?.includes(Roles.SuperAdmin),
          'data-testid': `${dataTestid}-publish-conceal`,
        },
      ],
    },
  ];
};
