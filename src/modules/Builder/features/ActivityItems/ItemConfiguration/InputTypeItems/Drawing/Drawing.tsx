import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Uploads } from 'modules/Builder/components';
import { Uploader, UploaderUiType } from 'shared/components';
import { ItemInputTypes } from 'shared/types';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_2MB } from 'shared/consts';
import { StyledFlexTopCenter, theme } from 'shared/styles';

import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';
import { DrawingProps } from './Drawing.types';
import { SharedToggleItemProps, ToggleItem } from '../ToggleItem';

export const Drawing = ({ drawerImage, drawerBgImage }: DrawingProps) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const mockedTooltipTitle = 'Image Description';

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
          getValue={() => watch(drawerImage)}
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
          getValue={() => watch(drawerBgImage)}
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
        <Uploader
          uiType={UploaderUiType.Secondary}
          width={5.6}
          height={5.6}
          setValue={(val: string) => setValue(drawerImage, val)}
          getValue={() => watch(drawerImage)}
          wrapperStyles={{ mr: theme.spacing(1) }}
        />
        <Uploader
          uiType={UploaderUiType.Secondary}
          width={5.6}
          height={5.6}
          setValue={(val: string) => setValue(drawerBgImage, val)}
          getValue={() => watch(drawerBgImage)}
        />
      </StyledFlexTopCenter>
    );
  const Content = () => (
    <Uploads
      uploads={uploads}
      wrapperStyles={{
        ml: theme.spacing(-4.8),
        justifyContent: 'flex-start',
      }}
    />
  );

  return <ToggleItem title={'Drawing'} HeaderContent={HeaderContent} Content={Content} />;
};
