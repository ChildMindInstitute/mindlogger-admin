import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useWatch } from 'react-hook-form';

import { Uploader } from 'shared/components';
import { MAX_FILE_SIZE_25MB } from 'shared/consts';
import { StyledBodyMedium, theme } from 'shared/styles';
import { byteFormatter } from 'shared/utils';
import { Uploads } from 'modules/Builder/components';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { CheckboxController } from 'shared/components/FormComponents/CheckboxController/CheckboxController';

import { DrawingContentProps } from './DrawingContent.types';

/* 
Disable feature until final solution in comments of M2-6037.
Replace the local constant with LaunchDarkly feature flag if it will be confirmed as a feature
*/
export const makeDrawingSpaceAdjustableFeatureFlag = false;

export const DrawingContent = ({ name }: DrawingContentProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();

  const drawingExampleName = `${name}.responseValues.drawingExample`;
  const drawingBackgroundName = `${name}.responseValues.drawingBackground`;
  const divideSpaceFlagName = `${name}.responseValues.proportion.enabled`;
  const [drawingExample, drawingBackground] = useWatch({
    name: [drawingExampleName, drawingBackgroundName],
  });
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
    <Box>
      <Uploads
        uploads={uploads}
        wrapperStyles={{
          m: theme.spacing(2, 0, 0, -4.8),
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          width: 'unset',
        }}
      />
      {makeDrawingSpaceAdjustableFeatureFlag && (
        <CheckboxController
          name={divideSpaceFlagName}
          control={control}
          label={<StyledBodyMedium>{t('drawingDivideFlagDescription')}</StyledBodyMedium>}
          sxLabelProps={{
            mt: theme.spacing(3),
          }}
          data-testid={`${dataTestid}-divide-content-flag`}
        />
      )}
    </Box>
  );
};
