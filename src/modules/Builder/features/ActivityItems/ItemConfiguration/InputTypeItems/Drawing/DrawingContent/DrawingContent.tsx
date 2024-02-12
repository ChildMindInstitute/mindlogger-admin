import { useTranslation } from 'react-i18next';

import { Uploader } from 'shared/components';
import { MAX_FILE_SIZE_25MB } from 'shared/consts';
import { theme } from 'shared/styles';
import { byteFormatter } from 'shared/utils';
import { Uploads } from 'modules/Builder/components';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { DrawingContentProps } from './DrawingContent.types';

export const DrawingContent = ({ name }: DrawingContentProps) => {
  const { t } = useTranslation('app');
  const { watch, setValue } = useCustomFormContext();

  const drawingExampleName = `${name}.responseValues.drawingExample`;
  const drawingBackgroundName = `${name}.responseValues.drawingBackground`;
  const drawingExample = watch(drawingExampleName);
  const drawingBackground = watch(drawingBackgroundName);
  const dataTestid = 'builder-activity-items-item-configuration-drawing';

  const commonUploaderProps = {
    width: 20,
    height: 20,
    flexibleCropRatio: true,
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
          data-testid={`${dataTestid}-example`}
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
          data-testid={`${dataTestid}-background`}
        />
      ),
    },
  ];

  return (
    <Uploads
      uploads={uploads}
      wrapperStyles={{
        mt: theme.spacing(2),
        ml: theme.spacing(-4.8),
        justifyContent: 'flex-start',
      }}
    />
  );
};
