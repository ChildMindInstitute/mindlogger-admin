import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { RecoverForm } from 'modules/Auth/features/RecoverPassword';
import { recoveryLinkHealthCheckApi } from 'api';
import { StyledBodyLarge, StyledLinkBtn } from 'shared/styles';
import { Spinner } from 'shared/components';
import { page } from 'resources';

export const RecoverPassword = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const key = searchParams.get('key');
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    recoveryLinkHealthCheckApi({ email, key })
      .catch((error) => {
        if (error instanceof Error) {
          setError(error);
        }
      })
      .finally(() => setIsLoading(false));
  }, [email, key]);

  if (isLoading) {
    return (
      <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
        <Spinner />
      </Box>
    );
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
