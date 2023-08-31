import { useState } from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components';
import { SubscaleTableDataSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';

import { TitleComponent } from '../../TitleComponent';
import { SubscaleHeaderContentProps } from './SubscaleHeaderContent.types';
import { StyledWrapper } from './SubscaleHeaderContent.styles';
import { LookupTable } from '../LookupTable';
import { getSubscaleModalLabels } from '../SubscalesConfiguration.utils';
import { subscaleColumnData, subscaleTableTemplate } from './SubscaleHeaderContent.const';
import { StyledSvg } from '../SubscalesConfiguration.styles';

export const SubscaleHeaderContent = ({
  onRemove,
  name,
  title,
  open,
  onUpdate,
  'data-testid': dataTestid,
}: SubscaleHeaderContentProps) => {
  const { watch } = useFormContext();
  const subscaleName = watch(`${name}.name`);
  const subscaleTableData = watch(`${name}.subscaleTableData`) ?? [];
  const [isSubscaleLookupTableOpened, setIsSubscaleLookupTableOpened] = useState(false);
  const iconId = `lookup-table${subscaleTableData?.length ? '-filled' : ''}`;

  return (
    <>
      <StyledWrapper>
        <TitleComponent title={title} name={name} open={open} />
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(1.4) }}
            onClick={() => {
              setIsSubscaleLookupTableOpened(true);
            }}
            data-testid={`${dataTestid}-lookup-table`}
          >
            <StyledSvg isFilled={!!subscaleTableData?.length} id={iconId} width="20" height="20" />
          </StyledClearedButton>
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={onRemove}
            data-testid={`${dataTestid}-remove`}
          >
            <Svg id="trash" width="20" height="20" />
          </StyledClearedButton>
        </Box>
      </StyledWrapper>
      {isSubscaleLookupTableOpened && (
        <LookupTable
          open={isSubscaleLookupTableOpened}
          labelsObject={getSubscaleModalLabels(subscaleName)}
          columnData={subscaleColumnData}
          tableData={subscaleTableData}
          template={subscaleTableTemplate}
          templatePrefix={'subscale_'}
          schema={SubscaleTableDataSchema}
          onUpdate={onUpdate}
          onClose={() => {
            setIsSubscaleLookupTableOpened(false);
          }}
          data-testid={`${dataTestid}-lookup-table-popup`}
        />
      )}
    </>
  );
};
