import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';
import get from 'lodash.get';

import { Svg, Table, UiType } from 'shared/components';
import {
  StyledBodyMedium,
  StyledSvgPrimaryColorBtn,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { FlankerStimulusSettings } from 'shared/state';
import { exportTemplate, getUploadedMediaName } from 'shared/utils';

import { IsPracticeRoundType, RoundTypeEnum } from '../../RoundSettings.types';
import { ImportSequencesPopup, ImportSequencesType } from './ImportSequencesPopup';
import {
  getRoundBlocks,
  getSequencesData,
  getSequencesHeadCells,
  getTableFromSequences,
  getUploadedTableRows,
} from './BlockSequencesContent.utils';
import { UploadedTable } from './BlockSequencesContent.types';

export const BlockSequencesContent = ({ isPracticeRound }: IsPracticeRoundType) => {
  const { t } = useTranslation();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { perfTaskItemField, perfTaskItemObjField } = useCurrentActivity();

  const [importTableVisible, setImportTableVisible] = useState(false);
  const [uploadedTable, setUploadedTable] = useState<UploadedTable>(null);

  const stimulusField = `${perfTaskItemField}.general.stimulusTrials`;
  const roundField = `${perfTaskItemField}.${
    isPracticeRound ? RoundTypeEnum.Practice : RoundTypeEnum.Test
  }`;
  const blockSequencesField = `${roundField}.blocks`;
  const stimulusTrials: FlankerStimulusSettings[] = watch(stimulusField);
  const blockSequences = watch(blockSequencesField);

  const blockSequencesObjField = `${perfTaskItemObjField}.${
    isPracticeRound ? RoundTypeEnum.Practice : RoundTypeEnum.Test
  }.blocks`;
  const hasBlockSequencesErrors = !!get(errors, blockSequencesObjField);

  const prevStimulusTrialsLength = useRef(stimulusTrials?.length);

  const { defaultExportTable, defaultTableRows } = getSequencesData(stimulusTrials);
  const tableRows = uploadedTable ? getUploadedTableRows(uploadedTable) : defaultTableRows || [];

  const tableWrapperStyles = { opacity: uploadedTable ? '1' : '0.5' };
  const importSequencesUiType = uploadedTable
    ? ImportSequencesType.Update
    : ImportSequencesType.Upload;
  const btnIconId = uploadedTable ? 'edit' : 'add';
  const btnText = t(`${uploadedTable ? 'update' : 'upload'}`);

  useEffect(() => {
    if (!uploadedTable?.length) return;
    const blocks = getRoundBlocks(stimulusTrials, uploadedTable);
    if (!blocks) return;

    setValue(blockSequencesField, blocks);
  }, [uploadedTable, stimulusTrials]);

  useEffect(() => {
    if (!blockSequences?.length || !stimulusTrials?.length) return;

    const initialUploadedTable = getTableFromSequences(stimulusTrials, blockSequences);
    initialUploadedTable && setUploadedTable(initialUploadedTable);
  }, []);

  useEffect(() => {
    if (stimulusTrials?.length < prevStimulusTrialsLength.current) {
      setUploadedTable(null);
      setValue(blockSequencesField, []);
    }

    prevStimulusTrialsLength.current = stimulusTrials?.length;
  }, [stimulusTrials]);

  return stimulusTrials?.some((trial) => !!trial.image) ? (
    <>
      <Box>
        {!uploadedTable && (
          <StyledTitleMedium sx={{ mb: theme.spacing(1.5) }}>
            {t('flankerRound.exampleOfSequence')}
          </StyledTitleMedium>
        )}
        <Box sx={tableWrapperStyles}>
          <Table
            columns={getSequencesHeadCells(uploadedTable)}
            rows={tableRows}
            orderBy=""
            uiType={UiType.Quaternary}
          />
        </Box>
        <StyledSvgPrimaryColorBtn
          sx={{ m: theme.spacing(2, 0, 0.5) }}
          onClick={() => setImportTableVisible(true)}
          startIcon={<Svg id={btnIconId} width="1.8rem" height="1.8rem" />}
          variant="text"
        >
          {btnText}
        </StyledSvgPrimaryColorBtn>
        {!uploadedTable && hasBlockSequencesErrors && (
          <StyledBodyMedium
            sx={{ pt: theme.spacing(2.4) }}
            color={variables.palette.semantic.error}
          >
            {t('fillInAllRequired')}
          </StyledBodyMedium>
        )}
      </Box>
      {importTableVisible && (
        <ImportSequencesPopup
          open={importTableVisible}
          onClose={() => setImportTableVisible(false)}
          onDownloadCsv={() => exportTemplate(uploadedTable || defaultExportTable, 'template')}
          onDownloadXlsx={() =>
            exportTemplate(uploadedTable || defaultExportTable, 'template', true)
          }
          uiType={importSequencesUiType}
          uploadedImages={stimulusTrials.map((trial) => getUploadedMediaName(trial.image))}
          setUploadedTable={setUploadedTable}
        />
      )}
    </>
  ) : (
    <StyledBodyMedium
      sx={{ m: theme.spacing(-1.5, 0, 1) }}
      color={variables.palette.semantic.error}
    >
      {t('flankerRound.addStimulus')}
    </StyledBodyMedium>
  );
};
