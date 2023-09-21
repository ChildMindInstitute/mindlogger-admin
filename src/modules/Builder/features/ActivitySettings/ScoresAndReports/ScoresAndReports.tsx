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
import { Tooltip } from 'shared/components/Tooltip';
import { CheckboxController } from 'shared/components/FormComponents';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { ToggleItemContainer, DndDroppable } from 'modules/Builder/components';
import { SettingParam, getEntityKey } from 'shared/utils';
import { useIsServerConfigured } from 'shared/hooks';
import { ScoreOrSection, ScoreReport, SectionReport } from 'shared/state';
import { page } from 'resources';
import { ScoreReportType } from 'shared/consts';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { commonButtonProps } from '../ActivitySettings.const';
import { SectionScoreHeader } from './SectionScoreHeader';
import { SectionContent } from './SectionContent';
import { getReportIndex, getScoreDefaults, getSectionDefaults } from './ScoresAndReports.utils';
import { ScoreContent } from './ScoreContent';
import { Title } from './Title';
import { StyledConfigureBtn } from './ScoresAndReports.styles';

export const ScoresAndReports = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { fieldName } = useCurrentActivity();
  const { control, setValue, getFieldState } = useFormContext();

  useActivitiesRedirection();

  const scoresAndReportsName = `${fieldName}.scoresAndReports`;
  const generateReportName = `${scoresAndReportsName}.generateReport`;
  const showScoreSummaryName = `${scoresAndReportsName}.showScoreSummary`;
  const reportsName = `${scoresAndReportsName}.reports`;
  const isServerConfigured = useIsServerConfigured();

  const {
    fields: reports,
    append: appendReport,
    remove: removeReport,
    move: moveReport,
  } = useFieldArray<Record<string, ScoreOrSection[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: reportsName,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const isCheckboxesDisabled = !reports?.length;
  const dataTestid = 'builder-activity-settings-scores-and-reports';

  const handleAddScore = () => {
    appendReport(getScoreDefaults() as ScoreReport);
  };

  const handleAddSection = () => {
    appendReport(getSectionDefaults() as SectionReport);
  };

  const navigateToSettings = () =>
    navigate(
      generatePath(page.builderAppletSettingsItem, {
        appletId,
        setting: SettingParam.ReportConfiguration,
      }),
    );

  const handleReportDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    if (!destination) return;
    moveReport(source.index, destination.index);
  };

  useEffect(() => {
    if (reports?.length) return;

    setValue(generateReportName, false);
    setValue(showScoreSummaryName, false);
  }, [reports]);

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
            <StyledConfigureBtn
              onClick={navigateToSettings}
              data-testid={`${dataTestid}-configure-server`}
            >
              {t('configure')}
            </StyledConfigureBtn>
          </>
        )}
      </StyledBodyLarge>
      <CheckboxController
        disabled={isCheckboxesDisabled}
        control={control}
        key={generateReportName}
        name={generateReportName}
        label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
        data-testid={`${dataTestid}-generate-report`}
      />
      <CheckboxController
        disabled={isCheckboxesDisabled}
        control={control}
        key={showScoreSummaryName}
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
        data-testid={`${dataTestid}-show-score-summary`}
      />
      <StyledFlexColumn sx={{ mt: theme.spacing(2.4) }}>
        <DragDropContext onDragEnd={handleReportDragEnd}>
          <DndDroppable droppableId="sar-reports-dnd" direction="vertical">
            {({ droppableProps, innerRef, placeholder }) => (
              <Box {...droppableProps} ref={innerRef}>
                {reports?.map((report, index) => {
                  const isSection = report.type === ScoreReportType.Section;
                  const reportName = `${reportsName}.${index}`;
                  const title = t(isSection ? 'sectionHeader' : 'scoreHeader', {
                    index: getReportIndex(reports, report) + 1,
                  });
                  const key = `data-section-${getEntityKey(report) || index}`;
                  const sectionDataTestid = `${dataTestid}-section-${index}`;
                  const headerTitle = (
                    <Title title={title} name={report?.name} data-testid={sectionDataTestid} />
                  );

                  return (
                    <Draggable key={key} draggableId={key} index={index}>
                      {({ innerRef, draggableProps, dragHandleProps }) => (
                        <Box ref={innerRef} {...draggableProps}>
                          <ToggleItemContainer
                            HeaderContent={SectionScoreHeader}
                            Content={isSection ? SectionContent : ScoreContent}
                            errorMessage={getFieldState(reportName).error?.message || null}
                            hasError={!!getFieldState(reportName).error}
                            headerContentProps={{
                              onRemove: () => {
                                removeReport(index);
                              },
                              name: reportName,
                              title: headerTitle,
                              dragHandleProps,
                            }}
                            contentProps={{
                              name: reportName,
                              title,
                              ...(isSection && { sectionId: report.id }),
                              ...(!isSection && { index }),
                              'data-testid': sectionDataTestid,
                            }}
                            data-testid={sectionDataTestid}
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
