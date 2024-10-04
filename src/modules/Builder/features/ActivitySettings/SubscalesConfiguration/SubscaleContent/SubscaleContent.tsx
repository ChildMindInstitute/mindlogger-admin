import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { StyledFlexColumn, StyledFlexTopStart, StyledTitleMedium, theme } from 'shared/styles';
import {
  useCheckAndTriggerOnNameUniqueness,
  useCurrentActivity,
  useCustomFormContext,
} from 'modules/Builder/hooks';
import {
  InputController,
  SelectController,
  TransferListController,
} from 'shared/components/FormComponents';
import { DataTable } from 'shared/components/DataTable';
import { SubscaleFormValue } from 'modules/Builder/types';
import { checkOnItemTypeAndScore } from 'shared/utils/checkOnItemTypeAndScore';
import { ScoreOrSection, ScoreReport } from 'shared/state';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { scoreValues } from './SubscaleContent.const';
import { SubscaleContentProps } from '../SubscalesConfiguration.types';
import {
  getItemElements,
  getColumns,
  getNotUsedElementsTableColumns,
} from '../SubscalesConfiguration.utils';
import { StyledWrapper } from './SubscaleContent.styles';

export const SubscaleContent = ({
  subscaleId,
  name,
  notUsedElements,
  'data-testid': dataTestid,
}: SubscaleContentProps) => {
  const { t } = useTranslation('app');
  const { control } = useCustomFormContext();
  const { fieldName = '', activity } = useCurrentActivity();
  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const subscales: SubscaleFormValue[] = useWatch({ name: subscalesField }) ?? [];
  const subscaleName: string = useWatch({ name: `${name}.name` });
  const items = getItemElements(
    subscaleId,
    activity?.items.filter(checkOnItemTypeAndScore),
    subscales,
  );

  const reportsField = `${fieldName}.scoresAndReports.reports`;
  const { fields: reports, update: updateReport } = useFieldArray<
    Record<string, ScoreOrSection[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control,
    name: reportsField,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  useCheckAndTriggerOnNameUniqueness({
    currentPath: name,
    entitiesFieldPath: subscalesField,
  });

  return (
    <StyledFlexColumn sx={{ mt: theme.spacing(2) }}>
      <StyledFlexTopStart sx={{ mb: theme.spacing(2.4), gap: theme.spacing(2) }}>
        <InputController
          key={`${name}.name`}
          name={`${name}.name`}
          label={t('subscaleName')}
          data-testid={`${dataTestid}-name`}
          withDebounce
          onChange={(e, onChange) => {
            onChange();

            // Also update the name of this subscale in any score reports that are linked to it
            reports.forEach((report, index) => {
              if (
                report.type === 'score' &&
                report.scoringType === 'score' &&
                report.linkedSubscaleName === subscaleName
              ) {
                const updatedReport: ScoreReport = {
                  ...report,
                  linkedSubscaleName: e.target.value,
                };
                updateReport(index, updatedReport);
              }
            });
          }}
        />
        <SelectController
          name={`${name}.scoring`}
          control={control}
          fullWidth
          options={scoreValues}
          label={t('subscaleScoring')}
          data-testid={`${dataTestid}-scoring`}
        />
      </StyledFlexTopStart>
      <StyledTitleMedium sx={{ mb: theme.spacing(1) }}>
        {t('elementsWithinSubscale')}
      </StyledTitleMedium>
      <StyledWrapper>
        <TransferListController
          name={`${name}.items`}
          items={items}
          columns={getColumns()}
          hasSearch={false}
          hasSelectedSection={false}
          data-testid={`${dataTestid}-items`}
        />
        <DataTable
          columns={getNotUsedElementsTableColumns()}
          data={notUsedElements}
          noDataPlaceholder={t('noElementsYet')}
          data-testid={`${dataTestid}-unused-items`}
        />
      </StyledWrapper>
    </StyledFlexColumn>
  );
};
