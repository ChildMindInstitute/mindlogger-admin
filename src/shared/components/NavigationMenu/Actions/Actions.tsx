import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import { ExportDataSetting } from 'shared/features/AppletSettings/ExportDataSetting';
import { useCheckIfNewApplet } from 'shared/hooks';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents/Flex';
import { Mixpanel, isManagerOrOwner, MixpanelEventType, MixpanelProps } from 'shared/utils';
import { workspaces, applet } from 'redux/modules';

import { StyledSettingsGroup, StyledSettings, StyledSetting, StyledTitle } from './Actions.styles';
import { ActionsProps } from './Actions.types';
import { DATA_TESTID_ACTIONS_EXPORT_DATA } from './Actions.const';

export const Actions = ({ isCompact }: ActionsProps) => {
  const { appletId } = useParams();
  const { t } = useTranslation('app');
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};

  const workspaceRoles = workspaces.useRolesData();
  const roles = appletData?.id ? workspaceRoles?.data?.[appletData.id] : undefined;
  const isVisible = isManagerOrOwner(roles?.[0]);

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  return isVisible ? (
    <StyledSettingsGroup isCompact={isCompact}>
      <StyledSettings isCompact={isCompact}>
        <span>
          <StyledSetting
            onClick={() => {
              setIsExportOpen(true);
              Mixpanel.track(MixpanelEventType.ExportDataClick, {
                [MixpanelProps.AppletId]: appletData?.id ?? appletId,
              });
            }}
            isCompact={isCompact}
            disabled={isNewApplet}
            data-testid={DATA_TESTID_ACTIONS_EXPORT_DATA}
          >
            <StyledFlexAllCenter>
              <Svg id="export" />
            </StyledFlexAllCenter>
            <StyledTitle>{t('exportData')}</StyledTitle>
          </StyledSetting>
        </span>
      </StyledSettings>
      <ExportDataSetting
        isExportSettingsOpen={isExportOpen}
        onExportSettingsClose={() => {
          setIsExportOpen(false);
        }}
      />
    </StyledSettingsGroup>
  ) : null;
};
