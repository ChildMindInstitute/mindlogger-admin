import { useState, useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
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
import { defaultConditionalValue } from './SectionContent.const';

export const SectionContent = ({ name }: SectionContentProps) => {
  const { t } = useTranslation('app');
  const { control, getFieldState, watch, register, unregister, setValue } = useFormContext();
  const [isContainConditional, setIsContainConditional] = useState(false);

  const hasPrintItemsError = getFieldState(`${name}.printItems`).error as unknown as Record<
    string,
    FieldError
  >;

  const conditionalLogicName = `${name}.conditionalLogic`;
  const conditionalLogic = watch(conditionalLogicName);

  useEffect(() => {
    if (isContainConditional) {
      register(conditionalLogicName);
      setValue(conditionalLogicName, defaultConditionalValue);

      return;
    }

    unregister(conditionalLogicName);
    setValue(conditionalLogicName, undefined);
  }, [isContainConditional]);

  return (
    <StyledFlexColumn>
      <InputController control={control} name={`${name}.name`} label={t('sectionName')} />
      <Box sx={{ mt: theme.spacing(2.4) }}>
        {conditionalLogic ? (
          <ToggleItemContainer
            HeaderContent={SectionScoreHeader}
            Content={ConditionContent}
            contentProps={{
              name: conditionalLogicName,
              type: ScoreConditionRowType.Section,
            }}
            headerContentProps={{
              onRemove: () => setIsContainConditional(false),
              title: t('conditionalLogic'),
            }}
            uiType={ToggleContainerUiType.Score}
          />
        ) : (
          <StyledButton
            sx={{ mt: 0 }}
            startIcon={<Svg id="add" width="20" height="20" />}
            onClick={() => setIsContainConditional(true)}
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
