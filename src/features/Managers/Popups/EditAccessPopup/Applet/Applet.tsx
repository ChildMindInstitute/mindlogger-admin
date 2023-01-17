import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChipShape } from 'components/Chip/Chip.types';
import { ButtonWithMenu, Chip } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import theme from 'styles/theme';
import { Roles } from 'consts';

import { StyledApplet, StyledRow, StyledBtn, StyledLabel, StyledImg } from './Applet.styles';
import { getMenuItems } from './Applet.const';
import { AppletProps } from './Applet.types';
import { getRoleIcon } from '../EditAccessPopup.utils';
import { Applet as AppletType } from '../EditAccessPopup.types';

export const Applet = ({ title, img, roles, index, setApplets, applets }: AppletProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const updateRolesHandler = (callback: (currentApplet: AppletType) => void) => {
    const newApplets = [...applets];
    newApplets[index] = { ...newApplets[index] };
    callback(newApplets[index]);
    setApplets(newApplets);
  };

  const handleRemove = (label: string) => {
    updateRolesHandler(
      (currentApplet) =>
        (currentApplet.roles = currentApplet?.roles.filter((el) => el.label !== label)),
    );
  };

  const handleAddRole = (label: string) => {
    updateRolesHandler((currentApplet) => {
      if (!currentApplet?.roles.find((el) => el.label === label)) {
        currentApplet.roles = [...currentApplet.roles, { label, icon: getRoleIcon(label) }];
      }
    });
    setAnchorEl(null);
  };

  return (
    <StyledApplet>
      <StyledRow>
        <StyledFlexTopCenter>
          {img && <StyledImg src={img} alt={title} />}
          <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.2) }}>{title}</StyledBodyMedium>
        </StyledFlexTopCenter>
        <ButtonWithMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          menuItems={getMenuItems(handleAddRole)}
          label={t('addRole')}
        />
      </StyledRow>
      {roles?.map((el) => (
        <Chip
          shape={ChipShape.rounded}
          color="secondary"
          icon={el.icon}
          key={el.label}
          title={
            <StyledLabel>
              {el.label === Roles.reviewer ? (
                <>
                  {t(el.label)}: <StyledBtn variant="body2">{t('editRespondents')}</StyledBtn>
                </>
              ) : (
                t(el.label) || ''
              )}
            </StyledLabel>
          }
          onRemove={() => handleRemove(el.label)}
        />
      ))}
    </StyledApplet>
  );
};
