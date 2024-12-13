import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import {
  DataRetention,
  EditAppletSetting,
  TransferOwnershipSetting,
  DuplicateAppletSettings,
  DeleteAppletSetting,
  PublishConcealAppletSetting,
  VersionHistorySetting,
  ShareAppletSetting,
} from 'shared/features/AppletSettings';
import {
  Mixpanel,
  SettingParam,
  isManagerOrOwner,
  checkIfCanEdit,
  MixpanelEventType,
  MixpanelProps,
} from 'shared/utils';
import { Item as ItemNavigation } from 'shared/components/NavigationMenu';

import { GetSettings } from './DashboardAppletSettings.types';

export const getSettings = ({
  isPublished,
  roles,
  appletId,
  enableShareToLibrary,
}: GetSettings): ItemNavigation[] => {
  const dataTestid = 'dashboard-applet-settings';
  const canEdit = checkIfCanEdit(roles);
  const isShareToLibraryVisible = !!(enableShareToLibrary && canEdit);
  const isSharingVisible = roles?.includes(Roles.SuperAdmin) || isShareToLibraryVisible;

  return [
    {
      label: 'usersAndData',
      isVisible: isManagerOrOwner(roles?.[0]),
      items: [
        {
          icon: <Svg id="data-retention" />,
          label: 'dataRetention',
          component: <DataRetention isDashboard />,
          param: SettingParam.DataRetention,
          'data-testid': `${dataTestid}-data-retention`,
        },
        {
          icon: <Svg id="integrations" />,
          label: 'integrations',
          component: <PublishConcealAppletSetting />,
          param: SettingParam.PublishConceal,
          'data-testid': `${dataTestid}-publish-conceal`,
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
          onClick: () =>
            Mixpanel.track({
              action: MixpanelEventType.AppletEditClick,
              [MixpanelProps.AppletId]: appletId,
            }),
        },
        // Description: "Download Schema" logic is hidden until it will be used in future features
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
          component: <PublishConcealAppletSetting isDashboard />,
          param: SettingParam.PublishConceal,
          isVisible: roles?.includes(Roles.SuperAdmin),
          'data-testid': `${dataTestid}-publish-conceal`,
        },
      ],
    },
  ];
};
