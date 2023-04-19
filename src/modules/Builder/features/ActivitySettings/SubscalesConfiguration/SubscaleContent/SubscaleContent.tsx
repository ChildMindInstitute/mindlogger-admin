import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledTitleMedium,
  theme,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import {
  InputController,
  SelectController,
  TransferListController,
} from 'shared/components/FormComponents';
import { DataTable } from 'shared/components';
import { AppletFormValues } from 'modules/Builder/pages';

import { scoreValues } from './SubscaleContent.const';
import { SubscaleContentProps } from '../SubscalesConfiguration.types';
import {
  getItemElements,
  columns,
  notUsedElementsTableColumns,
  filterItemElements,
} from '../SubscalesConfiguration.utils';

export const SubscaleContent = ({ subscaleId, name, notUsedElements }: SubscaleContentProps) => {
  const { t } = useTranslation('app');
  const { control } = useFormContext();
  const subscales: AppletFormValues['subscales'] = useWatch({ name: 'subscales' });
  const { activity } = useCurrentActivity();
  const items = getItemElements(subscaleId, activity?.items.filter(filterItemElements), subscales);

  return (
    <StyledFlexColumn>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(4.4), gap: theme.spacing(2) }}>
        <InputController name={`${name}.name`} label={t('subscaleName')} />
        <SelectController
          name={`${name}.scoring`}
          control={control}
          fullWidth
          options={scoreValues}
          label={t('subscaleScoring')}
        />
      </StyledFlexTopCenter>
      <StyledTitleMedium sx={{ mb: theme.spacing(1) }}>
        {t('elementsWithinSubscale')}
      </StyledTitleMedium>
      <StyledFlexTopStart sx={{ mb: theme.spacing(4.4), gap: theme.spacing(2) }}>
        <TransferListController
          name={`${name}.items`}
          items={items}
          columns={columns}
          hasSearch={false}
          hasSelectedSection={false}
        />
        <DataTable
          columns={notUsedElementsTableColumns}
          data={notUsedElements}
          noDataPlaceholder={t('noElementsYet')}
          styles={{ width: '100%' }}
        />
      </StyledFlexTopStart>
    </StyledFlexColumn>
  );
};
