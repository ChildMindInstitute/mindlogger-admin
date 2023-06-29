import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Uploads, SharedToggleItemProps, ToggleItemContainer } from 'modules/Builder/components';
import { Uploader } from 'shared/components';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_25MB } from 'shared/consts';
import { StyledFlexTopCenter, theme } from 'shared/styles';

import { DrawingProps } from './Drawing.types';
import { StyledImage } from './Drawing.styles';

export const Drawing = ({ name }: DrawingProps) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();

  const drawingExampleName = `${name}.responseValues.drawingExample`;
  const drawingBackgroundName = `${name}.responseValues.drawingBackground`;
  const drawingExample = watch(drawingExampleName);
  const drawingBackground = watch(drawingBackgroundName);

  const commonUploaderProps = {
    width: 20,
    height: 20,
  };

  const uploads = [
    {
      title: t('drawingExample'),
      tooltipTitle: t('drawingExampleDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(drawingExampleName, val || undefined)}
          getValue={() => drawingExample}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
        />
      ),
    },
    {
      title: t('drawingBackground'),
      tooltipTitle: t('drawingBackgroundDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(drawingBackgroundName, val || undefined)}
          getValue={() => drawingBackground}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
        />
      ),
    },
  ];

  const HeaderContent = ({ open }: SharedToggleItemProps) =>
    open ? null : (
      <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
        {drawingExample && <StyledImage src={drawingExample} />}
        {drawingBackground && <StyledImage src={drawingBackground} />}
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
