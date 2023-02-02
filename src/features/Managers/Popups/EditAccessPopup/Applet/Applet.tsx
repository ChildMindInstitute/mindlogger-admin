import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChipShape } from 'components/Chip/Chip.types';
import { ButtonWithMenu, Chip } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import theme from 'styles/theme';
import { Roles } from 'consts';
import { MenuItem } from 'components/Menu/Menu.types';

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
    handleAddSelectedRespondents(id, []);
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
            disabled={!getFilteredMenuItems().length}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={getFilteredMenuItems()}
            label={t('addRole')}
          />
        </StyledRow>
        {roles?.map((role) => (
          <Chip
            shape={ChipShape.rounded}
            color={
              appletsWithoutRespondents.includes(title) && role.label === Roles.reviewer
                ? 'error'
                : 'secondary'
            }
            icon={role.icon}
            key={role.label}
            title={
              <StyledLabel>
                {role.label === Roles.reviewer ? (
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
      <SelectRespondentsPopup
        appletName={title}
        user={user}
        selectRespondentsPopupVisible={selectRespondentsPopupVisible}
        selectedRespondents={selectedRespondents || []}
        onClose={handleClosePopup}
      />
    </>
  );
};
