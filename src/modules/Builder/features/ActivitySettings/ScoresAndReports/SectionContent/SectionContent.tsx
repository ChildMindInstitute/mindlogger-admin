import { FieldError, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledFlexColumn, theme, variables } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { SectionContentProps } from './SectionContent.types';
import { ConditionContent } from '../ConditionContent';
import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { ScoreConditionRowType } from '../ConditionContent/ConditionContent.types';

export const SectionContent = ({ name }: SectionContentProps) => {
  const { t } = useTranslation('app');
  const { control, getFieldState, watch } = useFormContext();

  const hasPrintItemsError = getFieldState(`${name}.printItems`).error as unknown as Record<
    string,
    FieldError
  >;

  const conditionalLogicName = `${name}.conditionalLogic`;
  const conditionalLogic = watch(conditionalLogicName);

  const { append: appendConditional, remove: removeConditional } = useFieldArray({
    control,
    name: conditionalLogicName,
  });

  const onRemoveConditional = () => {
    removeConditional(0);
  };

  return (
    <StyledFlexColumn>
      <InputController name={`${name}.name`} label={t('sectionName')} />
      <Box sx={{ mt: theme.spacing(2.4) }}>
        {conditionalLogic?.length ? (
          <ToggleItemContainer
            HeaderContent={SectionScoreHeader}
            Content={ConditionContent}
            contentProps={{
              name: `${conditionalLogicName}.0`,
              type: ScoreConditionRowType.Section,
            }}
            headerContentProps={{
              onRemove: onRemoveConditional,
              title: t('conditionalLogic'),
            }}
            uiType={ToggleContainerUiType.Score}
          />
        ) : (
          <StyledButton
            sx={{ mt: 0 }}
            startIcon={<Svg id="add" width="20" height="20" />}
            onClick={() => appendConditional({})}
          >
            {t('addConditinalLogic')}
          </StyledButton>
        )}
      </Box>
      {hasPrintItemsError && (
        <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
          {t('validationMessages.mustShowMessageOrItems')}
        </StyledBodyMedium>
      )}
      <SectionScoreCommonFields name={name} />
    </StyledFlexColumn>
  );
};
