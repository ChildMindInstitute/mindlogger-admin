import { Box, Button, IconButton } from '@mui/material';
import { useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { getAppletPublicLinkApi } from 'api';
import { Svg } from 'shared/components';
import { useAsync } from 'shared/hooks';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  variables,
} from 'shared/styles';

import { StyledInput, StyledLinkLabel } from './PublicLinkToggle.style';
import { PublicLinkToggleProps } from './PublicLinkToggle.types';

export const PublicLinkToggle = ({
  appletId,
  'data-testId': dataTestId,
  onConfirmPublicLink,
  sx,
  ...otherProps
}: PublicLinkToggleProps) => {
  const { t } = useTranslation('app');
  const { execute, isLoading, value } = useAsync(getAppletPublicLinkApi);
  const { link, requireLogin } = value?.data.result ?? {};
  const hasPublicLink = !!link;
  const inputId = useId();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
  };

  useEffect(() => {
    if (appletId) {
      execute({ appletId });
    }
  }, [appletId, execute]);

  return (
    <StyledFlexSpaceBetween
      data-testId={dataTestId}
      sx={{ flexDirection: 'column', gap: 1.6, ...sx }}
      {...otherProps}
    >
      <StyledFlexSpaceBetween>
        <StyledFlexColumn sx={{ gap: 0.4 }}>
          <StyledTitleBoldMedium>{t('publicLink')}</StyledTitleBoldMedium>

          <StyledBodyLarge color={variables.palette.on_surface_variant}>
            {t('publicLinkDescription')}
          </StyledBodyLarge>
        </StyledFlexColumn>

        <Button
          color={hasPublicLink ? 'error' : undefined}
          data-testId={dataTestId && `${dataTestId}-confirm-btn`}
          disabled={isLoading}
          onClick={() => {
            onConfirmPublicLink?.(hasPublicLink);
          }}
          variant={hasPublicLink ? 'text' : 'outlined'}
        >
          {hasPublicLink ? t('deletePublicLink') : t('publicLinkCreate')}
        </Button>
      </StyledFlexSpaceBetween>

      {hasPublicLink && (
        <Box
          sx={{
            border: `1px solid ${variables.palette.surface_variant}`,
            borderRadius: variables.borderRadius.xs,
            overflow: 'hidden',
          }}
        >
          <StyledFlexTopCenter>
            <StyledInput
              data-testId={dataTestId && `${dataTestId}-input`}
              id={inputId}
              readOnly
              value={link}
            />

            <IconButton
              color="primary"
              data-testId={dataTestId && `${dataTestId}-copy-btn`}
              onClick={handleCopyLink}
              sx={{ p: 1.6 }}
            >
              <Svg
                aria-label={t('copyAppletLink')}
                fill="currentColor"
                id="duplicate"
                height={24}
                width={24}
              />
            </IconButton>
          </StyledFlexTopCenter>

          <StyledLinkLabel htmlFor={inputId}>
            <Svg aria-hidden id={requireLogin ? 'account' : 'coordinator'} width={18} height={18} />
            {requireLogin ? t('publicLinkAccountRequired') : t('publicLinkAccountNotRequired')}
          </StyledLinkLabel>
        </Box>
      )}
    </StyledFlexSpaceBetween>
  );
};
