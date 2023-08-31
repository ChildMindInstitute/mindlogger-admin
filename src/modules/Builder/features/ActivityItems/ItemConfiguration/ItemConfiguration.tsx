import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';

import { Modal } from 'shared/components';
import { EditorController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyMedium,
  StyledModalWrapper,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { StyledContent, StyledItemConfiguration } from './ItemConfiguration.styles';
import { ItemConfigurationProps, ItemsOptionGroup } from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { getInputTypeTooltip } from './ItemConfiguration.utils';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';
import { itemsForReviewableActivity } from '../../ActivityAbout/ActivityAbout.const';
import { useCheckIfItemHasVariables } from './ItemConfiguration.hooks';
import { ConfigurationHeader } from './ConfigurationHeader';

export const ItemConfiguration = ({ name, onClose }: ItemConfigurationProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation('app');
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);

  const methods = useFormContext();
  const { fieldName } = useCurrentActivity();
  const { message, isPopupVisible, onPopupConfirm } = useCheckIfItemHasVariables(name);

  const { control, watch } = methods;

  const responseType = watch(`${name}.responseType`) as ItemResponseTypeNoPerfTasks;
  const isReviewable = watch(`${fieldName}.isReviewable`);

  const availableItemsTypeOptions = isReviewable
    ? itemsTypeOptions.reduce((options: ItemsOptionGroup[], { groupName, groupOptions }) => {
        if (groupName !== 'select') return options;

        return [
          {
            groupName,
            groupOptions: groupOptions.filter(({ value }) =>
              itemsForReviewableActivity.includes(value),
            ),
          },
        ];
      }, [])
    : itemsTypeOptions;

  return (
    <>
      <StyledItemConfiguration ref={containerRef}>
        <ConfigurationHeader
          containerRef={containerRef}
          responseType={responseType}
          optionalItemsRef={optionalItemsRef}
          onClose={onClose}
        />
        <StyledContent>
          <Grid container direction="row" columns={2} spacing={2.4}>
            <Grid item xs={1}>
              <GroupedSelectSearchController
                name={`${name}.responseType`}
                options={availableItemsTypeOptions}
                control={control}
                data-testid="builder-activity-items-item-configuration-response-type"
              />
              <StyledBodyMedium
                sx={{ m: theme.spacing(0.2, 1.6, 4.8, 1.6) }}
                color={variables.palette.on_surface_variant}
              >
                {responseType && getInputTypeTooltip()[responseType]}
              </StyledBodyMedium>
            </Grid>
            <Grid item xs={1}>
              <InputController
                fullWidth
                name={`${name}.name`}
                control={control}
                label={t('itemName')}
                type="text"
                sx={{ mb: theme.spacing(4) }}
                data-testid="builder-activity-items-item-configuration-name"
              />
            </Grid>
          </Grid>
          <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
            {t('displayedContent')}
          </StyledTitleLarge>
          <EditorController
            name={`${name}.question`}
            control={control}
            data-testid="builder-activity-items-item-configuration-description"
          />
          <OptionalItemsAndSettings name={name} ref={optionalItemsRef} />
        </StyledContent>
      </StyledItemConfiguration>
      <Modal
        open={isPopupVisible}
        onClose={onPopupConfirm}
        onSubmit={onPopupConfirm}
        width={'62'}
        title={t('variablesWarning.title')}
        buttonText={t('ok')}
        data-testid="builder-activity-items-item-configuration-variables-warning-popup"
      >
        <StyledModalWrapper>{t(message)}</StyledModalWrapper>
      </Modal>
    </>
  );
};
