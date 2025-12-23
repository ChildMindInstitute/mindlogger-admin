import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'shared/components/Tooltip';
import { Svg } from 'shared/components/Svg';

import {
  StyledSecretKeyContainer,
  StyledSecretKey,
  StyledCopyButton,
} from './MFAManualSetup.styles';
import { CopyIcon } from './CopyIcon';
import { SecretKeyDisplayProps } from './SecretKeyDisplay.types';
import { Toast } from './Toast';

export const SecretKeyDisplay = ({ secretKey }: SecretKeyDisplayProps) => {
  const { t } = useTranslation('app');
  const [copied, setCopied] = useState(false);

  const handleCopySecret = async () => {
    if (secretKey) {
      try {
        await navigator.clipboard.writeText(secretKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy secret key:', err);
      }
    }
  };

  if (!secretKey) {
    return null;
  }

  return (
    <>
      <StyledSecretKeyContainer onClick={handleCopySecret} style={{ cursor: 'pointer' }}>
        <StyledSecretKey>{secretKey}</StyledSecretKey>
        <Tooltip
          tooltipTitle={copied ? t('mfa.secretKey.copied') : t('mfa.secretKey.copy')}
          placement="top"
        >
          <StyledCopyButton className="copy-button" copied={copied}>
            {copied ? <Svg id="check" width={16} height={16} /> : <CopyIcon />}
          </StyledCopyButton>
        </Tooltip>
      </StyledSecretKeyContainer>
      <Toast message={t('mfa.secretKey.copied')} show={copied} />
    </>
  );
};
