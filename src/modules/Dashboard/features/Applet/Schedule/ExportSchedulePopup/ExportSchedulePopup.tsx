import { useTranslation, Trans } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal, Table, UiType } from 'shared/components';
import { theme, StyledModalWrapper } from 'shared/styles';

import { ExportSchedulePopupProps } from './ExportSchedulePopup.types';
import { getHeadCells } from './ExportSchedulePopup.const';

export const ExportSchedulePopup = ({
  open,
  onClose,
  onSubmit,
  scheduleTableRows,
  respondentName,
  'data-testid': dataTestid,
}: ExportSchedulePopupProps) => {
  const { t } = useTranslation('app');
  const isIndividualSchedule = !!respondentName;

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isIndividualSchedule ? t('exportIndividualSchedule') : t('exportDefaultSchedule')}
      buttonText={t('export')}
      width="93.6"
      data-testid={dataTestid}>
      <StyledModalWrapper>
        <Box sx={{ margin: theme.spacing(-1.8, 0, 2.4) }}>
          {isIndividualSchedule ? (
            <Trans i18nKey="individualScheduleExport">
              The current individual schedule of respondent
              <strong>
                <>{{ respondentName }})</>
              </strong>
              will be exported as a <strong>.csv</strong> file.
            </Trans>
          ) : (
            <Trans i18nKey="defaultScheduleExport">
              The current default schedule will be exported as a <strong>.csv</strong> file.
            </Trans>
          )}
        </Box>
        <Table columns={getHeadCells()} rows={scheduleTableRows} orderBy="activityName" uiType={UiType.Tertiary} />
      </StyledModalWrapper>
    </Modal>
  );
};
