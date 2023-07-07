import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledFlexColumn, theme } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { ConditionRowType } from 'modules/Builder/types';

import { SectionContentProps } from './SectionContent.types';
import { ConditionContent } from '../ConditionContent';
import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { defaultConditionalValue } from './SectionContent.const';
import { RemoveConditionalLogicPopup } from '../RemoveConditionalLogicPopup';

export const SectionContent = ({ name, title }: SectionContentProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const conditionalLogicName = `${name}.conditionalLogic`;
  const conditionalLogic = watch(conditionalLogicName);
  const [isContainConditional, setIsContainConditional] = useState(!!conditionalLogic);
  const [isRemoveConditionalPopupVisible, setIsRemoveConditionalPopupVisible] = useState(false);

  useEffect(() => {
    if (isContainConditional) {
      !conditionalLogic && setValue(conditionalLogicName, defaultConditionalValue);

      return;
    }

    setValue(conditionalLogicName, undefined);
  }, [isContainConditional]);

  const removeConditional = () => {
    setIsRemoveConditionalPopupVisible(true);
  };

  return (
    <StyledFlexColumn sx={{ mt: theme.spacing(1.6) }}>
      <InputController control={control} name={`${name}.name`} label={t('sectionName')} />
      <Box sx={{ mt: theme.spacing(2.4) }}>
        {isContainConditional ? (
          <ToggleItemContainer
            HeaderContent={SectionScoreHeader}
            Content={ConditionContent}
            contentProps={{
              name: conditionalLogicName,
              type: ConditionRowType.Section,
            }}
            headerContentProps={{
              onRemove: removeConditional,
              title: t('conditionalLogic'),
              name: conditionalLogicName,
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
      <SectionScoreCommonFields name={name} />
      {isRemoveConditionalPopupVisible && (
        <RemoveConditionalLogicPopup
          onClose={() => setIsRemoveConditionalPopupVisible(false)}
          onRemove={() => setIsContainConditional(false)}
          name={title}
        />
      )}
    </StyledFlexColumn>
  );
};
