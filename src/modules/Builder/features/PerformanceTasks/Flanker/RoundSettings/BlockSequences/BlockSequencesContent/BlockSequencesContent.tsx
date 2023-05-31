import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { Svg, Table, UiType } from 'shared/components';
import {
  StyledBodyMedium,
  StyledSvgPrimaryColorBtn,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { FlankerStimulusSettings } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { exportTemplate } from 'shared/utils';

import { RoundType } from '../../RoundSettings.types';
import {
  getRoundBlocks,
  getSequencesData,
  getSequencesHeadCells,
  getUploadedTableRows,
} from './BlockSequencesContent.utils';
import { ImportSequencesPopup } from './ImportSequencesPopup';
import { ImportSequencesType } from './ImportSequencesPopup/ImportSequencesPopup.types';
import { UploadedTable } from './BlockSequencesContent.types';

export const BlockSequencesContent = ({ isPracticeRound }: RoundType) => {
  const { t } = useTranslation();
  const [importTableVisible, setImportTableVisible] = useState(false);
  const [uploadedTable, setUploadedTable] = useState<UploadedTable>(null);
  const { watch, setValue } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const stimulusField = `${fieldName}.general.stimulusTrials`;
  const stimulusTrials: FlankerStimulusSettings[] = watch(stimulusField);
  const blockSequencesField = `${fieldName}.${isPracticeRound ? 'practice' : 'test'}.blocks`;

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

  return stimulusTrials?.some((trial) => !!trial.imageName) ? (
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
          imageNames={stimulusTrials.map((trial) => trial.imageName)}
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
