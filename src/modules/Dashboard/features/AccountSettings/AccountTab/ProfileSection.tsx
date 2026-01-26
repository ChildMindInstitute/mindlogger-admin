import { useTranslation } from 'react-i18next';

import { Avatar } from 'shared/components';
import { auth } from 'redux/modules';
import { StyledBodyLarge, variables } from 'shared/styles';

import { StyledSection, StyledProfileSection, StyledAvatarWrapper } from './AccountTab.styles';

export const ProfileSection = () => {
  const { t } = useTranslation('app');
  const userInitials = auth.useUserInitials();

  return (
    <StyledSection>
      <StyledBodyLarge color={variables.palette.on_surface}>{t('mfa.profile')}</StyledBodyLarge>
      <StyledProfileSection>
        <StyledAvatarWrapper>
          <Avatar caption={userInitials} />
        </StyledAvatarWrapper>
      </StyledProfileSection>
    </StyledSection>
  );
};
