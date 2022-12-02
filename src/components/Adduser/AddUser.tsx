import { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

import { InputController } from 'components/FormComponents/InputController';
import { SelectController } from 'components/FormComponents/SelectController';
import { TagsInputController } from 'components/FormComponents/TagsInputController';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { getAppletInvitationApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';
import { prepareUsersData } from 'utils/prepareUsersData';
import { users, auth, account } from 'redux/modules';

import { StyledButton, StyledRow, StyledResetButton, StyledTitle } from './AddUser.styles';
import { fields, defaultValues, roles, langs, Roles, Fields } from './AddUser.const';
import { AddUserSchema } from './Adduser.schema';
import { FormValues } from './Adduser.types';

export const AddUser = () => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const [errorMessage, setErrorMessage] = useState('');
  const accountData = account.useData();
  const usersData = users.useUserData();
  const authData = auth.useData();
  const currentApplet = accountData?.account?.applets?.find((el) => el.id === id);
  const accountNameShowed =
    authData?.user?.displayName === authData?.account.accountName &&
    currentApplet?.roles?.includes('owner');
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isDirty, isValid },
    register,
    unregister,
  } = useForm<FormValues>({
    resolver: yupResolver(AddUserSchema()),
    defaultValues,
    mode: 'onChange',
  });
  const role = watch(Fields.role);

  const commonProps = {
    fullWidth: true,
    control,
  };

  const resetForm = () => reset();

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        const options = {
          ...values,
          accountName: values.accountName || authData?.account.accountName || '',
        };

        await getAppletInvitationApi({ appletId: id, options });
        setErrorMessage('');
        resetForm();
      }
    } catch (e) {
      setErrorMessage(getErrorMessage(e));
    }
  };

  const updateFields = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value === Roles.user) {
      register(Fields.nickName, { value: '' });
      register(Fields.MRN, { value: '' });
      unregister(Fields.accountName);
      unregister(Fields.users);
    } else {
      unregister(Fields.nickName);
      unregister(Fields.MRN);
      if (value === Roles.reviewer) {
        register(Fields.users, { value: [] });
      } else {
        unregister(Fields.users);
      }
      if (accountNameShowed) {
        register(Fields.accountName, { value: '' });
      }
    }
  };

  return (
    <>
      <StyledTitle>{t('addUser')}</StyledTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.4} alignItems="flex-start">
          <Grid container item xs={8} spacing={2.4}>
            {fields.map(({ name }) => (
              <Grid item xs={6} key={name}>
                <InputController {...commonProps} name={name} label={t(name)} />
              </Grid>
            ))}
            <Grid item xs={6}>
              <SelectController
                {...commonProps}
                name={Fields.role}
                options={roles}
                label={t(Fields.role)}
                customChange={updateFields}
              />
            </Grid>
            {role === Roles.reviewer && (
              <Grid item xs={12}>
                <TagsInputController
                  {...commonProps}
                  name={Fields.users}
                  // TO DO fix types
                  options={prepareUsersData(usersData?.items)?.map((el: any) => el?.MRN)}
                  label={t('userList')}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <SelectController
                {...commonProps}
                name={Fields.lang}
                options={langs}
                label={t('language')}
              />
            </Grid>
          </Grid>
          <Grid container item xs={4} rowSpacing={2.4}>
            {role === Roles.user && (
              <>
                <Grid item xs={12}>
                  <InputController {...commonProps} name={Fields.nickName} label={t('nickname')} />
                </Grid>
                <Grid item xs={12}>
                  <InputController {...commonProps} name={Fields.MRN} label={t('secretUserId')} />
                </Grid>
              </>
            )}
            {accountNameShowed && (
              <Grid item xs={12}>
                <InputController
                  {...commonProps}
                  name={Fields.accountName}
                  label={t('accountName')}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        <StyledRow>
          <StyledButton variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {t('submit')}
          </StyledButton>
          <StyledResetButton variant="outlined" onClick={resetForm}>
            {t('resetForm')}
          </StyledResetButton>
        </StyledRow>
      </form>
    </>
  );
};
