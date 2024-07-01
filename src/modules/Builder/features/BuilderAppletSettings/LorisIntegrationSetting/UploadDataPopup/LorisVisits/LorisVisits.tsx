import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { UiType } from 'shared/components/Table';
import { StyledTitleMedium, theme, variables } from 'shared/styles';
import { LorisUsersVisit, getLorisUsersVisitsApi, getLorisVisitsApi } from 'modules/Builder/api';

import { getHeadCells, getLorisActivitiesRows, formatData } from './LorisVisits.utils';
import { StyledLorisVisits, StyledTable } from './LorisVisits.styles';
import { LorisVisitsProps } from './LorisVisits.types';
import { Steps } from '../UploadDataPopup.types';

export const LorisVisits = ({ onSetIsLoading, setStep }: LorisVisitsProps) => {
  const { appletId } = useParams();

  const [usersVisits, setUsersVisits] = useState<LorisUsersVisit[]>([]);
  const [visitsList, setVisitsList] = useState<string[]>([]);

  const { t } = useTranslation();
  const { control, reset } = useFormContext();

  useEffect(() => {
    if (!appletId) return;

    const fetchData = async () => {
      try {
        onSetIsLoading(true);
        const [visitsResult, usersVisitsResult] = await Promise.all([
          getLorisVisitsApi(),
          getLorisUsersVisitsApi({ appletId }),
        ]);

        if (visitsResult?.data?.visits) {
          setVisitsList(visitsResult.data.visits);
        }

        if (usersVisitsResult?.data?.info) {
          const defaultValues = formatData(usersVisitsResult?.data?.info);

          reset({ visitsForm: defaultValues });
          setUsersVisits(usersVisitsResult?.data?.info);
        }
      } catch (error) {
        console.error(error);
        setStep(Steps.Error);
      } finally {
        onSetIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {visitsList.length > 0 && usersVisits.length > 0 && (
        <StyledLorisVisits data-testid="loris-visits">
          <StyledTitleMedium sx={{ mb: theme.spacing(2.4), color: variables.palette.on_surface }}>
            {t('loris.visitsDescription')}
          </StyledTitleMedium>
          <StyledTable
            maxHeight="34.4rem"
            columns={getHeadCells()}
            rows={getLorisActivitiesRows({ control, visitsList, usersVisits })}
            orderBy={'activityName'}
            uiType={UiType.Secondary}
            tableHeadBg={variables.modalBackground}
          />
        </StyledLorisVisits>
      )}
    </>
  );
};
