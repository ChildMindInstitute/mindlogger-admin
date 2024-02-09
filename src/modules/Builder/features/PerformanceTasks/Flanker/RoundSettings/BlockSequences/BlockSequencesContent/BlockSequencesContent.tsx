import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { FlankerItemPositions } from 'modules/Builder/types';
import { Svg, Table, UiType } from 'shared/components';
import { FlankerStimulusSettings } from 'shared/state';
import { StyledBodyMedium, StyledSvgPrimaryColorBtn, StyledTitleMedium, theme, variables } from 'shared/styles';
import { exportTemplate } from 'shared/utils';

import { BlockSequencesContentProps, UploadedTable } from './BlockSequencesContent.types';
import {
  getExportData,
  getRoundBlocks,
  getSequencesData,
  getSequencesHeadCells,
  getStimulusObject,
  getTableFromSequences,
  getUploadedTableRows,
} from './BlockSequencesContent.utils';
import { ImportSequencesPopup, ImportSequencesType } from './ImportSequencesPopup';

export const BlockSequencesContent = ({
  isPracticeRound,
  hasBlockSequencesErrors,
  'data-testid': dataTestid,
}: BlockSequencesContentProps) => {
  const { t } = useTranslation();
  const { watch, setValue, clearErrors } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();

  const [importTableVisible, setImportTableVisible] = useState(false);
  const [uploadedTable, setUploadedTable] = useState<UploadedTable>(null);

  const stimulusField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.stimulusTrials`;
  const roundField = `${fieldName}.items.${
    isPracticeRound ? FlankerItemPositions.PracticeFirst : FlankerItemPositions.TestFirst
  }.config`;
  const blockSequencesField = `${roundField}.blocks`;
  const stimulusTrials: FlankerStimulusSettings[] = watch(stimulusField);
  const blockSequences = watch(blockSequencesField);
  const hasStimulusTrials = stimulusTrials?.some((trial) => !!trial.image || !!trial.text);

  const prevStimulusTrialsLength = useRef(stimulusTrials?.length);

  const { defaultExportTable, defaultTableRows } = getSequencesData(stimulusTrials);
  const tableRows = uploadedTable ? getUploadedTableRows(uploadedTable?.data) : defaultTableRows || [];

  const tableWrapperStyles = { opacity: uploadedTable ? '1' : '0.5' };
  const importSequencesUiType = uploadedTable ? ImportSequencesType.Update : ImportSequencesType.Upload;
  const btnIconId = uploadedTable ? 'edit' : 'add';
  const btnText = t(`${uploadedTable ? 'update' : 'upload'}`);
  const exportData = getExportData(uploadedTable?.data) || defaultExportTable;

  useEffect(() => {
    if (uploadedTable?.isInitial || !uploadedTable?.data?.length) return;
    const blocks = getRoundBlocks(stimulusTrials, uploadedTable?.data);
    if (!blocks) return;

    clearErrors(blockSequencesField);
    setValue(blockSequencesField, blocks);
  }, [uploadedTable]);

  useEffect(() => {
    const stimulusTrialsLength = stimulusTrials?.length;
    if (!stimulusTrialsLength) return;

    if (stimulusTrialsLength < prevStimulusTrialsLength.current) {
      setUploadedTable(null);
      setValue(blockSequencesField, []);
    }

    if (
      blockSequences?.length &&
      stimulusTrialsLength === prevStimulusTrialsLength.current &&
      stimulusTrials.every((trial) => !!(trial.image || trial.text))
    ) {
      const newUploadedTable = getTableFromSequences(stimulusTrials, blockSequences);
      newUploadedTable && setUploadedTable({ isInitial: true, data: newUploadedTable });
    }

    prevStimulusTrialsLength.current = stimulusTrialsLength;
  }, [stimulusTrials]);

  return hasStimulusTrials ? (
    <>
      <Box>
        {!uploadedTable && (
          <StyledTitleMedium sx={{ mb: theme.spacing(1.5) }}>{t('flankerRound.exampleOfSequence')}</StyledTitleMedium>
        )}
        <Box sx={tableWrapperStyles}>
          <Table
            columns={getSequencesHeadCells(uploadedTable?.data)}
            rows={tableRows}
            orderBy=""
            uiType={UiType.Quaternary}
            data-testid={`${dataTestid}-table`}
          />
        </Box>
        <StyledSvgPrimaryColorBtn
          sx={{ m: theme.spacing(2, 0, 0.5) }}
          onClick={() => setImportTableVisible(true)}
          startIcon={<Svg id={btnIconId} width="1.8rem" height="1.8rem" />}
          variant="text"
          data-testid={`${dataTestid}-upload`}>
          {btnText}
        </StyledSvgPrimaryColorBtn>
        {!uploadedTable && hasBlockSequencesErrors && (
          <StyledBodyMedium sx={{ pt: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
            {t('fillInAllRequired')}
          </StyledBodyMedium>
        )}
      </Box>
      {importTableVisible && (
        <ImportSequencesPopup
          open={importTableVisible}
          onClose={() => setImportTableVisible(false)}
          onDownloadCsv={() =>
            exportTemplate({
              data: exportData,
              fileName: 'template',
            })
          }
          onDownloadXlsx={() =>
            exportTemplate({
              data: exportData,
              fileName: 'template',
              isXlsx: true,
            })
          }
          uiType={importSequencesUiType}
          uploadedImages={getStimulusObject(stimulusTrials, 'imageKey')}
          setUploadedTable={setUploadedTable}
        />
      )}
    </>
  ) : (
    <StyledBodyMedium sx={{ m: theme.spacing(-1.5, 0, 1) }} color={variables.palette.semantic.error}>
      {t('flankerRound.addStimulus')}
    </StyledBodyMedium>
  );
};
