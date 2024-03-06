import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { RecoverForm } from 'modules/Auth/features/RecoverPassword';
import { recoveryLinkHealthCheckApi } from 'api';
import { StyledBodyLarge, StyledFlexAllCenter, StyledLinkBtn } from 'shared/styles';
import { Spinner } from 'shared/components';
import { page } from 'resources';

import { recoveryPasswordDataTestid } from './RecoverPassword.const';

export const RecoverPassword = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const key = searchParams.get('key');
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const recoveryLinkHealthCheck = async () => {
      try {
        await recoveryLinkHealthCheckApi({ email, key });
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    recoveryLinkHealthCheck();
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
      <StyledFlexAllCenter>
        <StyledBodyLarge variant="body1" data-testid={`${recoveryPasswordDataTestid}-description`}>
          <Trans i18nKey="invalidPasswordResetLink">
            <StyledLinkBtn
              style={{ marginBottom: 3, fontSize: 16 }}
              variant="text"
              onClick={() => navigate(page.passwordReset)}
              data-testid={`${recoveryPasswordDataTestid}-link`}
            >
              here
            </StyledLinkBtn>
          </Trans>
        </StyledBodyLarge>
      </StyledFlexAllCenter>
    );
  }

  return <RecoverForm email={email!} resetKey={key!} />;
};
