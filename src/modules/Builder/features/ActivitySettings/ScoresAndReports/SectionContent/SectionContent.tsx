import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  useCurrentActivity,
  useCustomFormContext,
  useCheckAndTriggerOnNameUniqueness,
} from 'modules/Builder/hooks';
import { StyledFlexColumn, theme } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components/Svg';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { ConditionRowType } from 'modules/Builder/types';
import { isSectionReport } from 'shared/types';
import { SectionReport } from 'shared/state/Applet/Applet.schema';

import { SectionContentProps } from './SectionContent.types';
import { ConditionContent } from '../ConditionContent';
import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { defaultConditionalValue } from './SectionContent.const';
import { RemoveConditionalLogicPopup } from '../RemoveConditionalLogicPopup';

export const SectionContent = ({
  name,
  title,
  sectionId,
  'data-testid': dataTestid,
  items,
}: SectionContentProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const conditionalLogicName = `${name}.conditionalLogic`;
  const conditionalLogic = useWatch({ name: conditionalLogicName });
  const [isRemoveConditionalPopupVisible, setIsRemoveConditionalPopupVisible] = useState(false);
  const conditionalDataTestid = `${dataTestid}-conditional`;
  const { fieldName } = useCurrentActivity();
  const reportsName = `${fieldName}.scoresAndReports.reports`;

  useCheckAndTriggerOnNameUniqueness<SectionReport>({
    currentPath: name,
    entitiesFieldPath: reportsName,
    checkIfShouldIncludeEntity: isSectionReport,
  });

  const handleAddConditionalLogic = () => {
    setValue(conditionalLogicName, defaultConditionalValue);
  };

  const handleRemoveConditionalLogic = () => {
    setValue(conditionalLogicName, undefined);
  };

  const handleRemoveConditional = () => {
    setIsRemoveConditionalPopupVisible(true);
  };

  return (
    <StyledFlexColumn sx={{ mt: theme.spacing(1.6) }} data-testid={dataTestid}>
      <InputController
        control={control}
        key={`${name}.name`}
        name={`${name}.name`}
        label={t('sectionName')}
        data-testid={`${dataTestid}-name`}
        withDebounce
      />
      <Box sx={{ mt: theme.spacing(2.4) }}>
        {conditionalLogic ? (
          <ToggleItemContainer
            HeaderContent={SectionScoreHeader}
            Content={ConditionContent}
            contentProps={{
              name: conditionalLogicName,
              type: ConditionRowType.Section,
              'data-testid': conditionalDataTestid,
            }}
            headerContentProps={{
              onRemove: handleRemoveConditional,
              title: t('conditionalLogic'),
              name: conditionalLogicName,
              'data-testid': conditionalDataTestid,
            }}
            uiType={ToggleContainerUiType.Score}
            data-testid={conditionalDataTestid}
          />
        ) : (
          <StyledButton
            sx={{ mt: 0 }}
            startIcon={<Svg id="add" width="20" height="20" />}
            onClick={handleAddConditionalLogic}
            data-testid={`${dataTestid}-add-condition`}
          >
            {t('addConditionalLogic')}
          </StyledButton>
        )}
      </Box>
      <SectionScoreCommonFields
        name={name}
        sectionId={sectionId}
        data-testid={dataTestid}
        items={items}
      />
      {isRemoveConditionalPopupVisible && (
        <RemoveConditionalLogicPopup
          onClose={() => setIsRemoveConditionalPopupVisible(false)}
          onRemove={handleRemoveConditionalLogic}
          name={title}
          reportFieldName={name}
          data-testid={`${dataTestid}-remove-condition-popup`}
        />
      )}
    </StyledFlexColumn>
  );
};
