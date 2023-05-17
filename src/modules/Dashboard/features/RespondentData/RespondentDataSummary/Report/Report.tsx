import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Activity } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledHeadlineLarge, theme, variables } from 'shared/styles';

import { StyledTextBtn } from '../../RespondentData.styles';
import { ReportFilters } from './ReportFilters';
import { StyledHeader, StyledReport } from './Report.styles';
import { Subscales } from './Subscales';
import { FilterFormValues } from './Report.types';
import { filtersDefaultValues } from './Report.const';
import { ActivityCompleted } from './ActivityCompleted';
import { activityReport } from './mock';
import { ResponseOptions } from './ResponseOptions';

export const Report = ({ activity }: { activity: Activity }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  const methods = useForm<FilterFormValues>({
    defaultValues: filtersDefaultValues,
  });

  const watchFilterFields = methods.watch();

  const minDate = new Date(new Date().setMonth(new Date().getMonth() - 1)); // TODO: get from  date from backend

  useEffect(() => {
    // TODO: get data from backend
  }, [watchFilterFields]);

  return (
    <StyledReport ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>
        <StyledHeadlineLarge color={variables.palette.on_surface}>
          {activity.name}
        </StyledHeadlineLarge>
        <Tooltip tooltipTitle={t('configureServer')}>
          <span>
            <StyledTextBtn variant="text" startIcon={<Svg id="export" width="18" height="18" />}>
              {t('downloadLatestReport')}
            </StyledTextBtn>
          </span>
        </Tooltip>
      </StyledHeader>
      <Box sx={{ margin: theme.spacing(4.8, 6.4, 4.8) }}>
        <FormProvider {...methods}>
          <ReportFilters minDate={minDate} />
          <ActivityCompleted
            responses={activityReport.responses}
            versions={activityReport.versions}
          />
          <Subscales />
          {activityReport.responseOptions && (
            <ResponseOptions
              responseOptions={activityReport.responseOptions}
              versions={activityReport.versions}
            />
          )}
        </FormProvider>
      </Box>
    </StyledReport>
  );
};
