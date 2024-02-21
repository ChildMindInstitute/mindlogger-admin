import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useEffect } from 'react';
import { Box } from '@mui/material';

import { RecoverForm } from 'modules/Auth/features/RecoverPassword';
import { useAsync } from 'shared/hooks';
import { recoveryLinkHealthCheckApi } from 'api';
import { StyledBodyLarge, StyledLinkBtn } from 'shared/styles';
import { Spinner } from 'shared/components';
import { page } from 'resources';

export const RecoverPassword = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const key = searchParams.get('key');
  const email = searchParams.get('email');

  const {
    execute: validateKey,
    isLoading,
    error,
  } = useAsync(
    async (data: { email: string | null; key: string | null }) =>
      await recoveryLinkHealthCheckApi(data),
  );

  useEffect(() => {
    validateKey({ email, key });
  }, [email, key]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
        <StyledBodyLarge variant="body1" margin="16px 0px">
          <Box>
            <Trans i18nKey="invalidPasswordResetLink">
              <StyledLinkBtn
                style={{ marginBottom: 3, fontSize: 16 }}
                variant="text"
                onClick={() => navigate(page.passwordReset)}
              >
                here
              </StyledLinkBtn>
            </Trans>
          </Box>
        </StyledBodyLarge>
      </Box>
    );
  }

  return <RecoverForm email={email!} resetKey={key!} />;
};
