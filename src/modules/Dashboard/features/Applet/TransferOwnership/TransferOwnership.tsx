import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage } from 'shared/utils';
import { ApiResponseCodes, transferOwnershipApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { InputController } from 'shared/components/FormComponents';
import { StyledErrorText, StyledBodyLarge, theme } from 'shared/styles';
import { getEmailValidationSchema } from 'shared/utils';

import { StyledInputWrapper } from './TransferOwnership.styles';
import {
  TransferOwnershipFormValues,
  TransferOwnershipProps,
  TransferOwnershipRef,
} from './TransferOwnership.types';
import { defaultValues } from './TransferOwnership.const';

export const TransferOwnership = forwardRef<TransferOwnershipRef, TransferOwnershipProps>(
  (
    {
      appletId,
      appletName,
      isSubmitted,
      setIsSubmitted,
      setEmailTransferred,
      setNoPermissionPopupVisible,
      'data-testid': dataTestid,
    },
    ref,
  ) => {
    const { t } = useTranslation('app');
    const { getValues, handleSubmit, control, resetField, watch } =
      useForm<TransferOwnershipFormValues>({
        resolver: yupResolver(
          yup.object({
            email: getEmailValidationSchema(),
          }),
        ),
        defaultValues,
      });
    const email = watch('email');

    const { execute, error, setError } = useAsync(transferOwnershipApi, undefined, (error) => {
      if (error?.response?.status === ApiResponseCodes.Forbidden) {
        setNoPermissionPopupVisible(true);
      }
    });

    const handleTransferOwnership = async () => {
      if (!appletId) return;

      await execute({ appletId, email: getValues().email });
      setEmailTransferred(getValues().email);
    };

    useEffect(() => {
      if (isSubmitted) {
        handleSubmit(handleTransferOwnership)();
        setIsSubmitted(false);
      }
    }, [isSubmitted]);

    useImperativeHandle(
      ref,
      () => ({
        resetEmail() {
          resetField('email');
        },
      }),
      [],
    );

    useEffect(() => {
      error && setError(null);
    }, [email]);

    return (
      <form onSubmit={handleSubmit(handleTransferOwnership)} noValidate data-testid={dataTestid}>
        <Trans i18nKey="transferOwnershipConfirmation">
          <StyledBodyLarge>
            Are you sure you want to transfer ownership of Applet
            <strong>
              <>{{ appletName: appletName || t('Applet') }}</>
            </strong>
            to another user?
          </StyledBodyLarge>
          <StyledBodyLarge marginTop={theme.spacing(2.4)}>
            This action will transfer all Applet settings, created Schedules, the list of
            Respondents and Managers, as well as the data collected during the study.
          </StyledBodyLarge>
          <StyledBodyLarge marginTop={theme.spacing(0.4)}>
            Once the new owner confirms the transfer, you will no longer have access to this Applet
            or its data.
          </StyledBodyLarge>
          <StyledBodyLarge marginTop={theme.spacing(0.4)}>
            However, be assured that the transfer of Applet ownership will not impact Respondents.
            They will still be able to submit new responses.
          </StyledBodyLarge>
        </Trans>
        <StyledInputWrapper>
          <InputController
            required
            fullWidth
            name="email"
            control={control}
            label={t('ownerEmail')}
            helperText={error ? '' : t('transferOwnershipHelperText')}
            data-testid={`${dataTestid}-email`}
          />
        </StyledInputWrapper>
        {error && <StyledErrorText marginTop={0}>{getErrorMessage(error)}</StyledErrorText>}
      </form>
    );
  },
);
