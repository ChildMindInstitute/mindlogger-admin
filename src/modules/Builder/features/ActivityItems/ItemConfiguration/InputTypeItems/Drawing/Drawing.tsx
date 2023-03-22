import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Uploads } from 'modules/Builder/components';
import { Uploader } from 'shared/components';
import { ItemInputTypes } from 'shared/types';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_2MB } from 'shared/consts';
import { StyledFlexTopCenter, theme } from 'shared/styles';

import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';
import { DrawingProps } from './Drawing.types';
import { SharedToggleItemProps, ToggleItemContainer } from '../ToggleItemContainer';
import { StyledImage } from './Drawing.styles';

export const Drawing = ({ drawerImage, drawerBgImage }: DrawingProps) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const mockedTooltipTitle = 'Image Description';
  const drawerImageWatcher = watch(drawerImage);
  const drawerBgImageWatcher = watch(drawerBgImage);

  const commonUploaderProps = {
    width: 20,
    height: 20,
  };

  const uploads = [
    {
      title: t('drawingExample'),
      tooltipTitle: mockedTooltipTitle,
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(drawerImage, val)}
          getValue={() => drawerImageWatcher}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_2MB) })}
        />
      ),
    },
    {
      title: t('drawingBackground'),
      tooltipTitle: mockedTooltipTitle,
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(drawerBgImage, val)}
          getValue={() => drawerBgImageWatcher}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_2MB) })}
        />
      ),
    },
  ];

  useOptionalItemSetup({
    itemType: ItemInputTypes.Drawing,
    name: drawerImage,
  });

  useOptionalItemSetup({
    itemType: ItemInputTypes.Drawing,
    name: drawerBgImage,
  });

  const HeaderContent = ({ open }: SharedToggleItemProps) =>
    open ? null : (
      <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
        {drawerImageWatcher && <StyledImage src={drawerImageWatcher} />}
        {drawerBgImageWatcher && <StyledImage src={drawerBgImageWatcher} />}
      </StyledFlexTopCenter>
    );
  const Content = () => (
    <Uploads
      uploads={uploads}
      wrapperStyles={{
        mt: theme.spacing(2),
        ml: theme.spacing(-4.8),
        justifyContent: 'flex-start',
      }}
    />
  );

  return (
    <ToggleItemContainer title={t('drawing')} HeaderContent={HeaderContent} Content={Content} />
  );
};
