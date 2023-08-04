import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';

import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTooltipSvg,
  theme,
  variables,
} from 'shared/styles';
import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { ToggleItemContainer, DndDroppable } from 'modules/Builder/components';
import { getEntityKey } from 'shared/utils';
import { ScoreReport, SectionReport } from 'shared/state';
import { useIsServerConfigured } from 'shared/hooks';
import { page } from 'resources';

import { commonButtonProps } from '../ActivitySettings.const';
import { SectionScoreHeader } from './SectionScoreHeader';
import { SectionContent } from './SectionContent';
import { getScoreDefaults, getSectionDefaults } from './ScoresAndReports.utils';
import { ScoreContent } from './ScoreContent';
import { Title } from './Title';
import { StyledConfigureBtn } from './ScoresAndReports.styles';

export const ScoresAndReports = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { fieldName } = useCurrentActivity();
  const { control, watch, setValue } = useFormContext();

  useActivitiesRedirection();

  const scoresAndReportsName = `${fieldName}.scoresAndReports`;
  const generateReportName = `${scoresAndReportsName}.generateReport`;
  const showScoreSummaryName = `${scoresAndReportsName}.showScoreSummary`;
  const scoresName = `${scoresAndReportsName}.scores`;
  const sectionsName = `${scoresAndReportsName}.sections`;
  const isServerConfigured = useIsServerConfigured();

  const {
    append: appendScore,
    remove: removeScore,
    move: moveScore,
  } = useFieldArray({
    control,
    name: scoresName,
  });

  const {
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({
    control,
    name: sectionsName,
  });

  const sections: SectionReport[] = watch(sectionsName);
  const scores: ScoreReport[] = watch(scoresName);
  const showScoreSummary = watch(scoresAndReportsName);
  const generateReport = watch(generateReportName);
  const isCheckboxesDisabled = !(scores?.length || sections?.length);

  const handleAddScore = () => {
    appendScore(getScoreDefaults());
  };

  const handleAddSection = () => {
    appendSection(getSectionDefaults());
  };

  useEffect(() => {
    generateReport ?? setValue(generateReportName, false);
    showScoreSummary ?? setValue(showScoreSummaryName, false);
  }, [generateReport, showScoreSummary]);

  const navigateToSettings = () =>
    navigate(
      generatePath(page.builderAppletSettingsItem, {
        appletId,
        settingItem: 'report-configuration',
      }),
    );

  const handleScoreDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    if (!destination) return;
    moveScore(source.index, destination.index);
  };

  const handleSectionDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    if (!destination) return;
    moveSection(source.index, destination.index);
  };

  return (
    <>
      <StyledBodyLarge
        sx={{ mb: theme.spacing(2.4) }}
        color={
          isServerConfigured ? variables.palette.semantic.green : variables.palette.semantic.error
        }
      >
        {isServerConfigured ? (
          t('serverStatusConnected')
        ) : (
          <>
            {t('configureServerForReport')}
            <StyledConfigureBtn onClick={navigateToSettings}>{t('configure')}</StyledConfigureBtn>
          </>
        )}
      </StyledBodyLarge>
      <CheckboxController
        disabled={isCheckboxesDisabled}
        control={control}
        name={generateReportName}
        label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
      />
      <CheckboxController
        disabled={isCheckboxesDisabled}
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
      <StyledFlexColumn sx={{ mt: theme.spacing(2.4) }}>
        <DragDropContext onDragEnd={handleSectionDragEnd}>
          <DndDroppable droppableId="sar-sections-dnd" direction="vertical">
            {({ droppableProps, innerRef, placeholder }) => (
              <Box {...droppableProps} ref={innerRef}>
                {sections?.map((section, index) => {
                  const sectionName = `${sectionsName}.${index}`;
                  const title = t('sectionHeader', { index: index + 1 });
                  const headerTitle = <Title title={title} name={section?.name} />;
                  const key = `data-section-${getEntityKey(section) || index}`;

                  return (
                    <Draggable key={key} draggableId={key} index={index}>
                      {({ innerRef, draggableProps, dragHandleProps }) => (
                        <Box ref={innerRef} {...draggableProps}>
                          <ToggleItemContainer
                            HeaderContent={SectionScoreHeader}
                            Content={SectionContent}
                            headerContentProps={{
                              onRemove: () => {
                                removeSection(index);
                              },
                              name: sectionName,
                              title: headerTitle,
                              dragHandleProps,
                            }}
                            contentProps={{
                              sectionId: section.id,
                              name: sectionName,
                              title,
                            }}
                          />
                        </Box>
                      )}
                    </Draggable>
                  );
                })}
                {placeholder}
              </Box>
            )}
          </DndDroppable>
        </DragDropContext>
      </StyledFlexColumn>
      <DragDropContext onDragEnd={handleScoreDragEnd}>
        <DndDroppable droppableId="sar-scores-dnd" direction="vertical">
          {({ droppableProps, innerRef, placeholder }) => (
            <Box {...droppableProps} ref={innerRef}>
              {scores?.map((score, index) => {
                const scoreName = `${scoresName}.${index}`;
                const title = t('scoreHeader', { index: index + 1 });
                const headerTitle = <Title title={title} name={score?.name} />;
                const key = `data-score-${getEntityKey(score) || index}`;

                return (
                  <Draggable key={key} draggableId={key} index={index}>
                    {({ innerRef, draggableProps, dragHandleProps }) => (
                      <Box ref={innerRef} {...draggableProps}>
                        <ToggleItemContainer
                          HeaderContent={SectionScoreHeader}
                          Content={ScoreContent}
                          headerContentProps={{
                            onRemove: () => {
                              removeScore(index);
                            },
                            name: scoreName,
                            title: headerTitle,
                            dragHandleProps,
                          }}
                          contentProps={{
                            scoreId: score.id,
                            name: scoreName,
                            title,
                          }}
                        />
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {placeholder}
            </Box>
          )}
        </DndDroppable>
      </DragDropContext>
      <StyledFlexTopCenter>
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
