import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';
import {
  MediaType,
  MediaUploader,
  SharedToggleItemProps,
  ToggleItemContainer,
} from 'modules/Builder/components';
import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';

export const AudioPlayer = ({ name }: AudioPlayerProps) => {
  const { t } = useTranslation('app');
  const { setValue, getValues } = useFormContext();

  const url = getValues(`${name}.responseValues.file`);
  const [media, setMedia] = useState<MediaType | null>(url ? { url } : null);

  useEffect(() => {
    setValue(`${name}.responseValues.file`, media?.url ?? undefined);
  }, [media?.url]);

  const HeaderContent = ({ open }: SharedToggleItemProps) =>
    !open && !!media ? (
      <StyledNameWrapper>
        {media && <Svg id="check" width={18} height={18} />}{' '}
        <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{media?.name}</StyledName>
      </StyledNameWrapper>
    ) : null;

  const Content = () => (
    <Box sx={{ mt: theme.spacing(1) }}>
      <StyledTitleMedium color={variables.palette.on_surface} sx={{ mb: theme.spacing(1) }}>
        {t('audioPlayerDescription')}
      </StyledTitleMedium>
      <MediaUploader width={20} height={20} media={media} onUpload={setMedia} />
    </Box>
  );

  return (
    <ToggleItemContainer title={t('audioPlayer')} HeaderContent={HeaderContent} Content={Content} />
  );
};
