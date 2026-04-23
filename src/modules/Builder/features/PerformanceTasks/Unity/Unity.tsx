import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { StyledHeadlineLarge, StyledTitleLarge, theme } from 'shared/styles';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';

import { NameDescription } from '../NameDescription';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import UnityFileModal from './UnityFileModal/UnityFileModal';
import { UnityFileButton } from './UnityFileButton';

export const Unity = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();

  const [file, setFile] = useState<File | null>(null);

  const urlName = `${fieldName}.items[0].config.file`;
  const url = watch(urlName);

  const [fileContent, setFileContent] = useState<string>(url ? url : '');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const VALID_FILE_TYPES = [
    'application/x-yaml',
    'application/yaml',
    'text/yaml',
    'text/x-yaml',
    'text/plain',
    'application/json',
  ];

  const isValidFile = (file !== null && VALID_FILE_TYPES.includes(file.type)) || url?.length > 0;

  const dataTestid = 'builder-activity-unity';

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    const formFile = watch(urlName);
    if (formFile === null) {
      setFileContent('');

      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContentString = e.target?.result as string;
      setFileContent(fileContentString);
      setValue(urlName, fileContentString);
    };
    reader.readAsText(uploadedFile);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (url && url.length > 0) {
      setFileContent(url);
    }
  }, [url]);

  const contentProps = useMemo(
    () => ({ isValidFile, fileContent, onOpenModal: handleOpenModal }),
    [isValidFile, fileContent, handleOpenModal],
  );

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>
          {t('performanceTasks.unity')}
        </StyledHeadlineLarge>
        <NameDescription data-testid={dataTestid} />
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
          {t('unityInstructions')}
        </StyledTitleLarge>

        <ToggleItemContainer
          uiType={ToggleContainerUiType.PerformanceTask}
          title={t('unityTaskConfigurationFile')}
          Content={UnityFileButton}
          contentProps={contentProps}
          data-testid="builder-activity-unity-file-uploader"
        />
      </StyledPerformanceTaskBody>
      <UnityFileModal
        dataTestid={dataTestid}
        onUpload={handleUpload}
        onClose={() => handleCloseModal()}
        isOpen={isModalOpen}
      />
    </Box>
  );
};
