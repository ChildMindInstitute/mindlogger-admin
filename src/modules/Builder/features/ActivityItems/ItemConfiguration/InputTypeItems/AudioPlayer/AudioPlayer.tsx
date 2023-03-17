import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { FieldValues, useFormContext } from 'react-hook-form';

import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { ItemInputTypes } from 'shared/types';
import { MediaUploader, ResourceDataType } from 'modules/Builder/components';

import {
  StyledCollapsedWrapper,
  StyledItemOption,
} from '../SelectionOption/SelectionOption.styles';
import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';

export const AudioPlayer = ({ name, fileResource }: AudioPlayerProps<FieldValues>) => {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(true);
  const [resourceData, setResourceData] = useState<ResourceDataType | null>(null);
  const { setValue } = useFormContext();

  const { control } = useOptionalItemSetup({
    itemType: ItemInputTypes.AudioPlayer,
    name,
  });

  useOptionalItemSetup({
    itemType: ItemInputTypes.AudioPlayer,
    name: fileResource,
  });

  useEffect(() => {
    setValue(fileResource, resourceData?.url ?? undefined);
  }, [resourceData]);

  const handleOptionToggle = () => setOpen((prevState) => !prevState);

  return (
    <StyledItemOption>
      <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
        <StyledClearedButton sx={{ mr: theme.spacing(2) }} onClick={handleOptionToggle}>
          <Svg id={open ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledCollapsedWrapper>
          <StyledLabelBoldLarge>{t('audio')}</StyledLabelBoldLarge>
        </StyledCollapsedWrapper>
        {!open && !!resourceData && (
          <StyledNameWrapper>
            {resourceData.uploaded && <Svg id="check" width={18} height={18} />}{' '}
            <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{resourceData.name}</StyledName>
          </StyledNameWrapper>
        )}
      </StyledFlexTopCenter>
      {open && (
        <Box sx={{ mt: theme.spacing(1) }}>
          <StyledTitleMedium color={variables.palette.on_surface} sx={{ mb: theme.spacing(1) }}>
            {t('audioPlayerDescription')}
          </StyledTitleMedium>
          <InputController
            sx={{ mb: theme.spacing(2) }}
            name={name}
            control={control}
            label={t('mediaTranscript')}
          />
          <MediaUploader
            width={20}
            height={20}
            resourceData={resourceData}
            setResourceData={setResourceData}
          />
        </Box>
      )}
    </StyledItemOption>
  );
};
