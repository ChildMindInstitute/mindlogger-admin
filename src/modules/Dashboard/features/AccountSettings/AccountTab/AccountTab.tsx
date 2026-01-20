import { useTranslation } from 'react-i18next';

import { StyledTitleLarge } from 'shared/styles';
import { useFeatureFlags } from 'shared/hooks';

import { ProfileSection } from './ProfileSection';
import { EmailSection } from './EmailSection';
import { MFASection } from './MFASection';
import { useMFAStatus } from './useMFAStatus';
import { StyledTabContent, StyledSectionTitle, StyledDivider } from './AccountTab.styles';

interface AccountTabProps {
  isModalOpen: boolean;
  onShowBanner: (message: string) => void;
}

export const AccountTab = ({ isModalOpen, onShowBanner }: AccountTabProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const { isMFAEnabled, setIsMFAEnabled, refetchMFAStatus } = useMFAStatus(isModalOpen);

  return (
    <StyledTabContent>
      <StyledSectionTitle>
        <StyledTitleLarge>{t('mfa.accountSettings')}</StyledTitleLarge>
      </StyledSectionTitle>

      <ProfileSection />

      <EmailSection />

      <StyledDivider />

      {/* Two-Factor Authentication Section - Feature Flagged */}
      {featureFlags.enableMfa && (
        <MFASection
          isMFAEnabled={isMFAEnabled}
          setIsMFAEnabled={setIsMFAEnabled}
          refetchMFAStatus={refetchMFAStatus}
          isModalOpen={isModalOpen}
          onShowBanner={onShowBanner}
        />
      )}
    </StyledTabContent>
  );
};
