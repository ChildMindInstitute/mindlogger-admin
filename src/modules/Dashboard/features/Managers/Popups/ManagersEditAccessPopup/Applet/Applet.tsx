import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonWithMenu, Chip } from 'shared/components';
import { StyledFlexTopCenter, StyledBodyMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { Roles } from 'shared/consts';
import { ChipShape } from 'shared/components/Chip/Chip.types';
import { MenuItem } from 'shared/components/Menu/Menu.types';

import { StyledApplet, StyledRow, StyledBtn, StyledLabel, StyledImg } from './Applet.styles';
import { getMenuItems } from './Applet.const';
import { AppletProps } from './Applet.types';
import { SelectRespondentsPopup } from '../../SelectRespondentsPopup';

export const Applet = ({
  applet: { id, title, img, roles, selectedRespondents },
  addRole,
  removeRole,
  user,
  handleAddSelectedRespondents,
  appletsWithoutRespondents,
}: AppletProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectRespondentsPopupVisible, setSelectRespondentsPopupVisible] = useState(false);

  const isManager = !!roles.find((role) => role.label === Roles.Manager);

  const handleAddRole = (label: Roles) => {
    addRole(id, label);
    setAnchorEl(null);
  };

  const menuItems = getMenuItems(handleAddRole);

  const getFilteredMenuItems = () =>
    menuItems?.filter((menuItem: MenuItem) => !roles.find((role) => role.label === menuItem.title));

  const handleClosePopup = (selectedRespondents: string[]) => {
    handleAddSelectedRespondents(id, selectedRespondents);
    setSelectRespondentsPopupVisible(false);
  };

  const handleRemoveRole = (label: Roles) => {
    label === Roles.Reviewer && handleAddSelectedRespondents(id, []);
    removeRole(id, label);
  };

  return (
    <>
      <StyledApplet>
        <StyledRow>
          <StyledFlexTopCenter>
            {img && <StyledImg src={img} alt={title} />}
            <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.2) }}>{title}</StyledBodyMedium>
          </StyledFlexTopCenter>
          <ButtonWithMenu
            disabled={isManager}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={getFilteredMenuItems()}
            label={t('addRole')}
          />
        </StyledRow>
        {roles?.map((role) => (
          <Chip
            shape={ChipShape.Rounded}
            color={
              appletsWithoutRespondents.includes(title) && role.label === Roles.Reviewer
                ? 'error'
                : 'secondary'
            }
            icon={role.icon}
            key={role.label}
            title={
              <StyledLabel>
                {role.label === Roles.Reviewer ? (
                  <>
                    {t(role.label)}:{' '}
                    <StyledBtn
                      onClick={() => setSelectRespondentsPopupVisible(true)}
                      variant="body2"
                    >
                      {selectedRespondents?.slice(0, 3).join(', ') || t('editRespondents')}
                    </StyledBtn>
                  </>
                ) : (
                  t(role.label) || ''
                )}
              </StyledLabel>
            }
            onRemove={() => handleRemoveRole(role.label)}
          />
        ))}
      </StyledApplet>
      {selectRespondentsPopupVisible && (
        <SelectRespondentsPopup
          appletName={title}
          user={user}
          selectRespondentsPopupVisible={selectRespondentsPopupVisible}
          selectedRespondents={selectedRespondents || []}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};
