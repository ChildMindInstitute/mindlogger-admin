import { Grid, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';

import {
  InputController,
  SelectController,
  TagsAutocompleteController,
} from 'shared/components/FormComponents';
import { ApiLanguages } from 'api';
import { Roles } from 'shared/consts';
import { getRespondentName } from 'shared/utils';
import { Svg, Tooltip } from 'shared/components';
import { StyledFlexAllCenter } from 'shared/styles';
import { ParticipantSnippet } from 'modules/Dashboard/components';

import { AddManagerFormProps } from './AddManagerForm.types';
import { Fields } from '../AddManagerPopup.types';
import { getRoles } from '../AddManagerPopup.utils';

export const AddManagerForm = ({
  appletParticipants,
  appletRoles,
  control,
  isWorkspaceNameVisible,
  onSubmit,
  'data-testid': dataTestId,
}: AddManagerFormProps) => {
  const { t } = useTranslation('app');
  const [participantsHasFocus, setParticipantsHasFocus] = useState(false);
  const commonProps = {
    fullWidth: true,
    control,
  };
  const role = useWatch({ control, name: 'role' });

  return (
    <form onSubmit={onSubmit} noValidate data-testid={`${dataTestId}-form`}>
      <Grid container spacing={2.4}>
        <Grid item xs={6}>
          <SelectController
            {...commonProps}
            name={Fields.role}
            options={getRoles(appletRoles)}
            label={t('role')}
            data-testid={`${dataTestId}-role`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.email}
            label={t('emailAddress')}
            placeholder={t('emailAddressPlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestId}-email`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.firstName}
            label={t('firstName')}
            placeholder={t('firstNamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestId}-fname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.lastName}
            label={t('lastName')}
            placeholder={t('lastNamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestId}-lname`}
          />
        </Grid>
        <Grid item xs={isWorkspaceNameVisible ? 6 : 12}>
          <InputController
            {...commonProps}
            name={Fields.title}
            label={t('title')}
            placeholder={t('titlePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestId}-title`}
          />
        </Grid>
        {isWorkspaceNameVisible && (
          <Grid item xs={6}>
            <InputController
              {...commonProps}
              name={Fields.workspaceName}
              label={t('workspaceName')}
              placeholder={t('workspaceNamePlaceholder')}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip tooltipTitle={t('workspaceTooltip')}>
                      <StyledFlexAllCenter sx={{ cursor: 'default' }}>
                        <Svg id="more-info-outlined" width={24} height={24} />
                      </StyledFlexAllCenter>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              data-testid={`${dataTestId}-workspace`}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <SelectController
            {...commonProps}
            name={Fields.language}
            options={Object.values(ApiLanguages).map((lang) => ({ labelKey: lang, value: lang }))}
            label={t('invitationLanguage')}
            helperText={t('languageTooltip')}
            data-testid={`${dataTestId}-lang`}
          />
        </Grid>
        {role === Roles.Reviewer && (
          <Grid item xs={12}>
            <TagsAutocompleteController
              {...commonProps}
              name={Fields.participants}
              options={appletParticipants.map(({ subjectId, secretId, nickname, tag }) => ({
                id: subjectId,
                label: getRespondentName(secretId ?? '', nickname),
                secretId,
                nickname,
                tag,
              }))}
              renderOption={({ id, ...props }) => <ParticipantSnippet key={id} {...props} />}
              textFieldProps={{
                label: t('thisReviewerCanView'),
                placeholder: participantsHasFocus
                  ? t('searchParticipants')
                  : t('selectParticipants'),
                InputLabelProps: { shrink: true },
                onFocus: () => setParticipantsHasFocus(true),
                onBlur: () => setParticipantsHasFocus(false),
              }}
              labelAllSelect={`${t('selectAll')} (${appletParticipants.length})`}
              noOptionsText={t('noParticipants')}
              limitTagRows={3}
              data-testid={`${dataTestId}-participants`}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};
