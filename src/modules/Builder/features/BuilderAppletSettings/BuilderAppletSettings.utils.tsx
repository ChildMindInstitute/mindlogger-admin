import { lazy } from 'react';

import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import {
  DataRetention,
  TransferOwnershipSetting,
  ShareAppletSetting,
  DeleteAppletSetting,
  PublishConcealAppletSetting,
  VersionHistorySetting,
  LiveResponseStreamingSetting,
} from 'shared/features/AppletSettings';
import {
  Mixpanel,
  SettingParam,
  isManagerOrOwner,
  checkIfCanEdit,
  MixpanelEventType,
  MixpanelProps,
} from 'shared/utils';
import { Item as ItemNavigation } from 'shared/components/NavigationMenu/NavigationMenu.types';

import { GetSettings } from './BuilderAppletSettings.types';
import { IntegrationsListSetting } from './IntegrationsListSetting';

const ReportConfigSetting = lazy(() => import('modules/Builder/features/ReportConfigSetting'));

export const getSettings = ({
  isNewApplet,
  isPublished,
  roles,
  enableLorisIntegration,
  enableShareToLibrary,
  enableProlificIntegration,
  appletId,
}: GetSettings): ItemNavigation[] => {
  const tooltip = isNewApplet ? 'saveAndPublishFirst' : undefined;
  const dataTestid = 'builder-applet-settings';
  const canEdit = checkIfCanEdit(roles);
  const isShareToLibraryVisible = !!(enableShareToLibrary && canEdit);
  const isSharingVisible =
    !isNewApplet && (roles?.includes(Roles.SuperAdmin) || isShareToLibraryVisible);

  const showIntegrations = enableLorisIntegration || enableProlificIntegration;

  return [
    {
      label: 'usersAndData',
      items: [
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
        {
          icon: <Svg id="integrations" />,
          label: 'integrations',
          component: (
            <IntegrationsListSetting
              lorisIntegration={enableLorisIntegration}
              prolificIntegration={enableProlificIntegration}
            />
          ),
          param: SettingParam.Integrations,
          isVisible: showIntegrations,
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
          component: <ReportConfigSetting data-testid={`${dataTestid}-report-config-form`} />,
          param: SettingParam.ReportConfiguration,
          disabled: isNewApplet,
          tooltip,
          'data-testid': `${dataTestid}-report-config`,
          onClick: () =>
            Mixpanel.track({
              action: MixpanelEventType.AppletReportConfigurationClick,
              [MixpanelProps.AppletId]: appletId,
            }),
        },
      ],
    },

    {
      label: 'sharing',
      isVisible: isSharingVisible,
      items: [
        /*The "Share to Library" functionality is hidden in the UI under the feature flag "enableShareToLibrary"
        with workspaces ID limitations until the Moderation process within MindLogger is introduced. (Story:
        AUS-4.1.4.10).*/
        {
          icon: <Svg id="share" />,
          label: 'shareToLibrary',
          component: <ShareAppletSetting />,
          param: SettingParam.ShareApplet,
          isVisible: isShareToLibraryVisible,
          'data-testid': `${dataTestid}-share-to-library`,
        },
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
