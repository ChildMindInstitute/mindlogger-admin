import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, StyledTooltipSvg, theme } from 'shared/styles';
import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { ToggleItemContainer } from 'modules/Builder/components';
import { getEntityKey } from 'shared/utils';
import { ActivitySettingsSection } from 'shared/state';

import { commonButtonProps } from '../ActivitySettings.const';
import { SectionHeaderContent } from './SectionHeaderContent';
import { SectionContent } from './SectionContent/SectionContent';
import { getSectionDefaults } from './ScoresAndReports.utils';

export const ScoresAndReports = () => {
  const { t } = useTranslation('app');
  const { fieldName } = useCurrentActivity();
  const { control, watch } = useFormContext();
  const generateReportName = `${fieldName}.generateReport`;
  const showScoreSummaryName = `${fieldName}.showScoreSummary`;
  const scoresName = `${fieldName}.scores`;
  const sectionsName = `${fieldName}.sections`;

  const { append: appendScore, remove: removeScore } = useFieldArray({
    control,
    name: scoresName,
  });

  const { append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: sectionsName,
  });

  const sections: ActivitySettingsSection[] = watch(sectionsName);

  const handleAddScore = () => {
    appendScore({});
  };

  const handleAddSection = () => {
    appendSection(getSectionDefaults());
  };

  return (
    <>
      <CheckboxController
        control={control}
        name={generateReportName}
        label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
      />
      <CheckboxController
        control={control}
        name={showScoreSummaryName}
        label={
          <StyledFlexTopCenter>
            <StyledBodyLarge>{t('showScoreSummary')}</StyledBodyLarge>
            <Tooltip tooltipTitle={t('showScoreSummaryTooltip')}>
              <StyledFlexTopCenter>
                <StyledTooltipSvg id="more-info-outlined" width="20" height="20" />
              </StyledFlexTopCenter>
            </Tooltip>
          </StyledFlexTopCenter>
        }
      />
      {sections?.map((section, index) => {
        const sectionName = `${sectionsName}.${index}`;
        const title = t('sectionHeader', {
          index: index + 1,
          name: section?.name,
        });

        return (
          <ToggleItemContainer
            key={`data-subscale-${getEntityKey(section) || index}`}
            HeaderContent={SectionHeaderContent}
            Content={SectionContent}
            headerContentProps={{
              onRemove: () => {
                removeSection(index);
              },
              name: sectionName,
              title,
            }}
            contentProps={{
              sectionId: section.id,
              name: sectionName,
            }}
          />
        );
      })}
      <StyledFlexTopCenter sx={{ mt: theme.spacing(2.4) }}>
        <Button {...commonButtonProps} onClick={handleAddScore} sx={{ mr: theme.spacing(1.2) }}>
          {t('addScore')}
        </Button>
        <Button {...commonButtonProps} onClick={handleAddSection}>
          {t('addSection')}
        </Button>
      </StyledFlexTopCenter>
    </>
  );
};
