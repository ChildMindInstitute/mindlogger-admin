import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { Languages } from 'api';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';
import { PARTICIPANT_TAG_ICONS, ParticipantTag } from 'shared/consts';
import { Svg } from 'shared/components';

import { AddParticipantFormProps } from './AddParticipantForm.types';
import { Fields } from '../AddParticipantPopup.types';

export const AddParticipantForm = ({
  onSubmit,
  accountType,
  control,
  'data-testid': dataTestid,
}: AddParticipantFormProps) => {
  const { t } = useTranslation('app');
  const commonProps = {
    fullWidth: true,
    control,
  };
  const isFullAccount = accountType === AccountType.Full;

  return (
    <form onSubmit={onSubmit} noValidate data-testid={`${dataTestid}-form`}>
      <Grid container spacing={2.4}>
        {isFullAccount && (
          <Grid item xs={isFullAccount ? 6 : 12}>
            <InputController
              {...commonProps}
              name={Fields.email}
              label={t('emailAddress')}
              placeholder={t('emailAddressPlaceholder')}
              InputLabelProps={{ shrink: true }}
              data-testid={`${dataTestid}-email`}
            />
          </Grid>
        )}
        <Grid item xs={isFullAccount ? 6 : 12}>
          <InputController
            {...commonProps}
            name={Fields.secretUserId}
            label={t('secretUserId')}
            placeholder={t('secretUserIdPlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-secret-id`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.firstName}
            label={t('firstName')}
            placeholder={t('firstNamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-fname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.lastName}
            label={t('lastName')}
            placeholder={t('lastNamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-lname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.nickname}
            label={t('nickname')}
            placeholder={t('nicknamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-nickname`}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectController
            {...commonProps}
            name={Fields.tag}
            withChecked
            options={[
              ...Object.values(ParticipantTag).map((tag) => ({
                labelKey: `participantTag.${tag}`,
                value: tag,
                icon: <Svg id={PARTICIPANT_TAG_ICONS[tag]} width={24} height={24} />,
              })),
            ]}
            placeholder={t('selectOne')}
            InputLabelProps={{ shrink: true }}
            label={t('tag')}
            data-testid={`${dataTestid}-tag`}
          />
        </Grid>
        {isFullAccount && (
          <Grid item xs={12}>
            <SelectController
              {...commonProps}
              name={Fields.language}
              options={Object.values(Languages).map((lang) => ({ labelKey: lang, value: lang }))}
              label={t('invitationLanguage')}
              helperText={t('languageTooltip')}
              data-testid={`${dataTestid}-lang`}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};
