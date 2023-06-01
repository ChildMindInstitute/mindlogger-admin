import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, StyledTooltipSvg, theme } from 'shared/styles';
import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ToggleItemContainer } from 'modules/Builder/components';
import { getEntityKey } from 'shared/utils';
import { ActivitySettingsScore, ActivitySettingsSection } from 'shared/state';

import { commonButtonProps } from '../ActivitySettings.const';
import { SectionScoreHeader } from './SectionScoreHeader';
import { SectionContent } from './SectionContent';
import { getScoreDefaults, getSectionDefaults } from './ScoresAndReports.utils';
import { ScoreContent } from './ScoreContent';

export const ScoresAndReports = () => {
  const { t } = useTranslation('app');
  const { fieldName } = useCurrentActivity();
  const { control, watch } = useFormContext();
  const scoresAndReports = `${fieldName}.scoresAndReports`;
  const generateReportName = `${scoresAndReports}.generateReport`;
  const showScoreSummaryName = `${scoresAndReports}.showScoreSummary`;
  const scoresName = `${scoresAndReports}.scores`;
  const sectionsName = `${scoresAndReports}.sections`;

  const { append: appendScore, remove: removeScore } = useFieldArray({
    control,
    name: scoresName,
  });

  const { append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: sectionsName,
  });

  const sections: ActivitySettingsSection[] = watch(sectionsName);
  const scores: ActivitySettingsScore[] = watch(scoresName);

  const handleAddScore = () => {
    appendScore(getScoreDefaults());
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
            key={`data-section-${getEntityKey(section) || index}`}
            HeaderContent={SectionScoreHeader}
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
      {scores?.map((score, index) => {
        const scoreName = `${scoresName}.${index}`;
        const title = t('scoreHeader', {
          index: index + 1,
          name: score?.name,
        });

        return (
          <ToggleItemContainer
            key={`data-section-${getEntityKey(score) || index}`}
            HeaderContent={SectionScoreHeader}
            Content={ScoreContent}
            headerContentProps={{
              onRemove: () => {
                removeScore(index);
              },
              name: scoreName,
              title,
            }}
            contentProps={{
              scoreId: score.id,
              name: scoreName,
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
