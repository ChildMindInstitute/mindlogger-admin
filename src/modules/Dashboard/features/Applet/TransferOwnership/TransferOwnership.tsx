import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getErrorMessage } from 'shared/utils';
import { transferOwnershipApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { InputController } from 'shared/components/FormComponents';
import { StyledBodyLarge, theme } from 'shared/styles';
import { getEmailValidationSchema } from 'shared/utils';
import { workspaces } from 'shared/state/Workspaces';

import { StyledInputWrapper } from './TransferOwnership.styles';
import {
  TransferOwnershipFormValues,
  TransferOwnershipProps,
  TransferOwnershipRef,
} from './TransferOwnership.types';
import { defaultValues } from './TransferOwnership.const';
import { ArbitraryWarningPopup } from './ArbitraryWarningPopup';

export const TransferOwnership = forwardRef<TransferOwnershipRef, TransferOwnershipProps>(
  (
    {
      appletId,
      appletName,
      encryption,
      isSubmitted,
      setIsSubmitted,
      setEmailTransferred,
      'data-testid': dataTestid,
    },
    ref,
  ) => {
    const { t } = useTranslation('app');
    const { useArbitrary } = workspaces.useData() ?? {};
    const [warningPopupVisible, setWarningPopupVisible] = useState(false);
    const { getValues, setValue, handleSubmit, control, resetField /*, watch*/ } =
      useForm<TransferOwnershipFormValues>({
        resolver: yupResolver(
          yup.object({
            email: getEmailValidationSchema(),
          }),
        ),
        defaultValues,
      });
    const emailInputName = 'email';

    const { execute, error, setError } = useAsync(transferOwnershipApi);

    const handleEmailCustomChange = (event: ChangeEvent<HTMLInputElement>) => {
      setValue(emailInputName, event.target.value);
      if (!error) return;

      setError(null);
    };

    const executeTransferOwnership = useCallback(async () => {
      if (!appletId || !getValues || !execute || !setEmailTransferred) return;

      await execute({ appletId, email: getValues().email });
      setEmailTransferred(getValues().email);
    }, [getValues, appletId, setEmailTransferred, execute]);

    const handleTransferOwnership = useCallback(async () => {
      if (useArbitrary) {
        setWarningPopupVisible(true);

        return;
      }

      await executeTransferOwnership();
    }, [executeTransferOwnership, useArbitrary]);

    const handleArbitraryWarningClose = () => setWarningPopupVisible(false);
    const handleArbitraryWarningSubmit = async () => {
      setWarningPopupVisible(false);
      await executeTransferOwnership();
    };

    useEffect(() => {
      if (!isSubmitted || !handleTransferOwnership || !handleSubmit || !setIsSubmitted) return;

      handleSubmit(handleTransferOwnership)();
      setIsSubmitted(false);
    }, [isSubmitted, handleTransferOwnership, handleSubmit, setIsSubmitted]);

    useImperativeHandle(
      ref,
      () => ({
        resetEmail() {
          resetField(emailInputName);
        },
      }),
      [resetField],
    );

    return (
      <>
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
              Once the new owner confirms the transfer, you will no longer have access to this
              Applet or its data.
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
              name={emailInputName}
              control={control}
              label={t('ownerEmail')}
              helperText={error ? getErrorMessage(error) : t('transferOwnershipHelperText')}
              error={!!error}
              onChange={handleEmailCustomChange}
              data-testid={`${dataTestid}-email`}
            />
          </StyledInputWrapper>
        </form>
        {warningPopupVisible && (
          <ArbitraryWarningPopup
            isOpen={warningPopupVisible}
            onSubmit={handleArbitraryWarningSubmit}
            onClose={handleArbitraryWarningClose}
            appletId={appletId ?? ''}
            appletName={appletName ?? ''}
            encryption={encryption}
            data-testid="arbitrary-warning-popup"
          />
        )}
      </>
    );
  },
);
