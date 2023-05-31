import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { EditorUiType, Switch, TransferListController } from 'shared/components/FormComponents';
import { StyledFlexTopStart, theme } from 'shared/styles';
import { Item } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { DataTableItem } from 'shared/components';

import { CommonFieldsProps } from './SectionScoreCommonFields.types';
import { StyledEditor } from './SectionScoreCommonFields.styles';
import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { columns } from './SectionScoreCommonFields.const';

export const SectionScoreCommonFields = ({ name }: CommonFieldsProps) => {
  const { t } = useTranslation();

  const { control, watch } = useFormContext();
  const { activity } = useCurrentActivity();

  const showMessage: boolean = watch(`${name}.showMessage`);
  const printItems: boolean = watch(`${name}.printItems`);

  const items = activity?.items
    .filter(checkOnItemTypeAndScore)
    .map(({ id, name, question }: Item) => ({ id, name, question }));

  return (
    <>
      <Switch
        name={`${name}.showMessage`}
        control={control}
        label={t('showMessage')}
        tooltipText={t('showMessageTooltip')}
      />
      {showMessage && (
        <StyledEditor uiType={EditorUiType.Secondary} name={`${name}.message`} control={control} />
      )}
      <Switch
        name={`${name}.printItems`}
        control={control}
        label={t('printItems')}
        tooltipText={t('printItemsTooltip')}
      />
      {printItems && (
        <StyledFlexTopStart sx={{ mb: theme.spacing(2.4) }}>
          <TransferListController
            name={`${name}.itemsPrint`}
            items={items as unknown as DataTableItem[]}
            columns={columns}
            hasSearch={false}
            hasSelectedSection={false}
          />
        </StyledFlexTopStart>
      )}
    </>
  );
};
