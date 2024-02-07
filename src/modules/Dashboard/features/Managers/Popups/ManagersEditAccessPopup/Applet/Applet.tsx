import { useState, useRef } from 'react';
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
  applet: { id, displayName, image, roles },
  addRole,
  removeRole,
  user,
  handleAddSelectedRespondents,
  appletsWithoutRespondents,
}: AppletProps) => {
  const { t } = useTranslation('app');

  const selectedRespondents = roles?.flatMap(({ reviewerSubjects }) => reviewerSubjects ?? []);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectRespondentsPopupVisible, setSelectRespondentsPopupVisible] = useState(false);
  const isPristineRef = useRef(true);
  const hasManagerRole = isPristineRef.current && roles.some((item) => item.role === Roles.Manager);
  const addRoleTooltip = hasManagerRole ? t('userHasManagerAccess') : null;

  const handleAddRole = (label: Roles) => {
    addRole(id, label);
    setAnchorEl(null);
    isPristineRef.current = false;
  };

  const menuItems = getMenuItems(handleAddRole);
  const isAddRoleDisabled = menuItems?.length === roles.length || hasManagerRole;

  const getFilteredMenuItems = () =>
    menuItems?.filter((menuItem: MenuItem) => !roles.find(({ role }) => role === menuItem.title));

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
            {image && <StyledImg src={image} alt={displayName} />}
            <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.2) }}>
              {displayName}
            </StyledBodyMedium>
          </StyledFlexTopCenter>
          <ButtonWithMenu
            disabled={isAddRoleDisabled}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={getFilteredMenuItems()}
            label={t('addRole')}
            tooltip={addRoleTooltip}
          />
        </StyledRow>
        {roles?.map(({ role, icon }) => (
          <Chip
            shape={ChipShape.Rounded}
            color={
              appletsWithoutRespondents?.includes(displayName) && role === Roles.Reviewer
                ? 'error'
                : 'secondary'
            }
            icon={icon}
            key={role}
            title={
              <StyledLabel>
                {role === Roles.Reviewer ? (
                  <>
                    {t(role)}:{' '}
                    <StyledBtn
                      onClick={() => setSelectRespondentsPopupVisible(true)}
                      variant="body2"
                      data-testid="dashboard-managers-edit-access-edit-role"
                    >
                      {selectedRespondents?.join(', ') || t('editRespondents')}
                    </StyledBtn>
                  </>
                ) : (
                  t(role) || ''
                )}
              </StyledLabel>
            }
            onRemove={() => handleRemoveRole(role)}
          />
        ))}
      </StyledApplet>
      {selectRespondentsPopupVisible && (
        <SelectRespondentsPopup
          appletName={displayName}
          appletId={id}
          user={user}
          selectRespondentsPopupVisible={selectRespondentsPopupVisible}
          selectedRespondents={selectedRespondents || []}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};
