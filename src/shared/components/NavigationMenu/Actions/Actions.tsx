import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import { useCheckIfNewApplet } from 'shared/hooks';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents/Flex';
import { Mixpanel, isManagerOrOwner } from 'shared/utils';
import { workspaces, applet } from 'redux/modules';

import { StyledSettingsGroup, StyledSettings, StyledSetting, StyledTitle } from './Actions.styles';
import { ActionsProps } from './Actions.types';

export const Actions = ({ isCompact }: ActionsProps) => {
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
              Mixpanel.track('Export Data click');
            }}
            isCompact={isCompact}
            disabled={isNewApplet}
            data-testid="builder-applet-settings-export-data"
          >
            <StyledFlexAllCenter>
              <Svg id="export" />
            </StyledFlexAllCenter>
            <StyledTitle>{t('exportData')}</StyledTitle>
          </StyledSetting>
        </span>
      </StyledSettings>
      <ExportDataSetting
        isOpen={isExportOpen}
        onClose={() => {
          setIsExportOpen(false);
        }}
      />
    </StyledSettingsGroup>
  ) : null;
};
