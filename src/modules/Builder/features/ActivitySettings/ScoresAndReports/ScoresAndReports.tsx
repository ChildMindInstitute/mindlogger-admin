import { useEffect } from 'react';

import { Box, Button } from '@mui/material';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ToggleItemContainer, DndDroppable } from 'modules/Builder/components';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { removeMarkdown } from 'modules/Builder/utils';
import { page } from 'resources';
import { CheckboxController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components/Tooltip';
import { ScoreReportType } from 'shared/consts';
import { useIsServerConfigured } from 'shared/hooks';
import { ScoreOrSection, ScoreReport, SectionReport } from 'shared/state';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTooltipSvg,
  theme,
  variables,
} from 'shared/styles';
import { SettingParam, getEntityKey } from 'shared/utils';

import { commonButtonProps } from '../ActivitySettings.const';
import { checkOnItemTypeAndScore } from '../ActivitySettings.utils';
import { ScoreContent } from './ScoreContent';
import { ItemTypesToPrint } from './ScoresAndReports.const';
import { StyledConfigureBtn } from './ScoresAndReports.styles';
import { getReportIndex, getScoreDefaults, getSectionDefaults, getTableScoreItems } from './ScoresAndReports.utils';
import { SectionContent } from './SectionContent';
import { SectionScoreHeader } from './SectionScoreHeader';
import { Title } from './Title';

export const ScoresAndReports = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { fieldName } = useCurrentActivity();
  const { control, setValue, getFieldState } = useFormContext();
  const { activity } = useCurrentActivity();

  useRedirectIfNoMatchedActivity();

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

  const items = activity?.items.reduce((items: Pick<ItemFormValues, 'id' | 'name' | 'question'>[], item) => {
    if (!ItemTypesToPrint.includes(item.responseType)) return items;
    const { name, question } = item;

    return [...items, { id: getEntityKey(item), name, question: removeMarkdown(question) }];
  }, []);

  const scoreItems = activity?.items.filter(checkOnItemTypeAndScore);
  const tableItems = getTableScoreItems(scoreItems);

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
  }, [reports]);

  return (
    <>
      <StyledBodyLarge
        sx={{ mb: theme.spacing(2.4) }}
        color={isServerConfigured ? variables.palette.semantic.green : variables.palette.semantic.error}
      >
        {isServerConfigured ? (
          t('serverStatusConnected')
        ) : (
          <>
            {t('configureServerForReport')}
            <StyledConfigureBtn onClick={navigateToSettings} data-testid={`${dataTestid}-configure-server`}>
              {t('configure')}
            </StyledConfigureBtn>
          </>
        )}
      </StyledBodyLarge>
      <CheckboxController
        disabled={!reports?.length}
        control={control}
        key={generateReportName}
        name={generateReportName}
        label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
        data-testid={`${dataTestid}-generate-report`}
      />
      <CheckboxController
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
                  const key = `data-section-${getEntityKey(report, false) || index}`;
                  const reportDataTestid = `${dataTestid}-${isSection ? 'section' : 'score'}-${index}`;
                  const headerTitle = (
                    <Title title={title} reportFieldName={reportName} data-testid={reportDataTestid} />
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
                              'data-testid': reportDataTestid,
                            }}
                            contentProps={{
                              name: reportName,
                              title,
                              ...(isSection && { sectionId: report.id }),
                              ...(!isSection && { index, tableItems, scoreItems }),
                              'data-testid': reportDataTestid,
                              items,
                            }}
                            data-testid={`${reportDataTestid}-container`}
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
