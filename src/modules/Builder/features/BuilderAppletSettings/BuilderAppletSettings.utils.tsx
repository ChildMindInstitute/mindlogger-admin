import { Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import {
  DataRetention,
  TransferOwnershipSetting,
  ShareAppletSetting,
  DownloadSchemaSetting,
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
          visibility: isManagerOrOwner(roles?.[0]),
          'data-testid': `${dataTestid}-export-data`,
        },
        {
          icon: <Svg id="data-retention" />,
          label: 'dataRetention',
          component: <DataRetention />,
          param: SettingParam.DataRetention,
          disabled: isNewApplet,
          tooltip,
          visibility: isManagerOrOwner(roles?.[0]),
          'data-testid': `${dataTestid}-data-retention`,
        },
        {
          icon: <Svg id="live-response-streaming" />,
          label: 'liveResponseStreaming',
          component: <LiveResponseStreamingSetting />,
          param: SettingParam.LiveResponseStreaming,
          tooltip,
          'data-testid': `${dataTestid}-live-response-streaming`,
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
          param: SettingParam.DownloadSchema,
          disabled: isNewApplet,
          tooltip,
          'data-testid': `${dataTestid}-download-schema`,
        },
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
          visibility: roles?.[0] === Roles.Owner,
          'data-testid': `${dataTestid}-transfer-ownership`,
        },

        {
          icon: <Svg id="trash" />,
          label: 'deleteApplet',
          component: <DeleteAppletSetting />,
          param: SettingParam.DeleteApplet,
          disabled: isNewApplet,
          tooltip,
          visibility: isManagerOrOwner(roles?.[0]),
          'data-testid': `${dataTestid}-delete-applet`,
        },
      ],
    },
    {
      label: 'reports',
      visibility: true,
      items: [
        {
          icon: <Svg id="report-configuration" />,
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
      visibility: !isNewApplet,
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
          component: <PublishConcealAppletSetting isBuilder />,
          param: SettingParam.PublishConceal,
          disabled: isNewApplet,
          tooltip,
          visibility: roles?.includes(Roles.SuperAdmin),
          'data-testid': `${dataTestid}-publish-conceal`,
        },
      ],
    },
  ];
};
