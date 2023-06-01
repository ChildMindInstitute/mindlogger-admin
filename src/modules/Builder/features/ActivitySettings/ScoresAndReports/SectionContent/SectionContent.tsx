import { FieldError, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledFlexTopStart,
  theme,
  variables,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import {
  InputController,
  Switch,
  TransferListController,
  EditorUiType,
} from 'shared/components/FormComponents';
import { Svg } from 'shared/components';
import { Item } from 'shared/state';

import { columns } from './SectionContent.const';
import { StyledButton, StyledEditor } from './SectionContent.styles';
import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { SectionContentProps } from './SectionContent.types';

export const SectionContent = ({ name }: SectionContentProps) => {
  const { t } = useTranslation('app');
  const { control, getFieldState, watch } = useFormContext();
  const { activity } = useCurrentActivity();

  const showMessage: boolean = watch(`${name}.showMessage`);
  const printItems: boolean = watch(`${name}.printItems`);
  const items = activity?.items
    .filter(checkOnItemTypeAndScore)
    .map(({ id, name, question }: Item) => ({ id, name, question }));
  const hasPrintItemsError = getFieldState(`${name}.printItems`).error as unknown as Record<
    string,
    FieldError
  >;

  return (
    <StyledFlexColumn>
      <InputController name={`${name}.name`} label={t('sectionName')} />
      <StyledButton startIcon={<Svg id="add" width="20" height="20" />}>
        {t('addConditinalLogic')}
      </StyledButton>
      {hasPrintItemsError && (
        <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
          {t('validationMessages.mustShowMessageOrItems')}
        </StyledBodyMedium>
      )}
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
            items={items}
            columns={columns}
            hasSearch={false}
            hasSelectedSection={false}
          />
        </StyledFlexTopStart>
      )}
    </StyledFlexColumn>
  );
};
