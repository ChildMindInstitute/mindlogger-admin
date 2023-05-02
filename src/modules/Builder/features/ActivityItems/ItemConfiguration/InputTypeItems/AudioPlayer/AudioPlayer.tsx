import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { FieldValues, useFormContext } from 'react-hook-form';

import { StyledTitleMedium, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';
import {
  MediaUploader,
  ResourceDataType,
  SharedToggleItemProps,
  ToggleItemContainer,
} from 'modules/Builder/components';
import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';

export const AudioPlayer = ({ name, fileResource }: AudioPlayerProps<FieldValues>) => {
  const { t } = useTranslation('app');
  const [resourceData, setResourceData] = useState<ResourceDataType | null>(null);
  const { setValue } = useFormContext();

  const { control } = useOptionalItemSetup({
    itemType: ItemResponseType.AudioPlayer,
    name,
  });

  useOptionalItemSetup({
    itemType: ItemResponseType.AudioPlayer,
    name: fileResource,
  });

  useEffect(() => {
    setValue(fileResource, resourceData?.url ?? undefined);
  }, [resourceData]);

  const HeaderContent = ({ open }: SharedToggleItemProps) =>
    !open && !!resourceData ? (
      <StyledNameWrapper>
        {resourceData.uploaded && <Svg id="check" width={18} height={18} />}{' '}
        <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{resourceData.name}</StyledName>
      </StyledNameWrapper>
    ) : null;

  const Content = () => (
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
  );

  return <ToggleItemContainer title={t('audio')} HeaderContent={HeaderContent} Content={Content} />;
};
