import { useTranslation, Trans } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { InputController, SelectController } from 'shared/components/FormComponents';
import { StyledTitleBoldSmall, StyledIconButton, variables } from 'shared/styles';

import { items, options } from './Alert.const';
import { StyledAlert, StyledRow, StyledDescription } from './Alert.styles';
import { ItemConfigurationForm } from '../../ItemConfiguration.types';
import { AlertProps } from './Alert.types';

export const Alert = ({ index, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const { control } = useFormContext<ItemConfigurationForm>();

  // TODO: change fields depends on item type
  return (
    <StyledAlert>
      <StyledRow>
        <StyledTitleBoldSmall>
          {t('alert')} {index + 1}
        </StyledTitleBoldSmall>
        <StyledIconButton onClick={() => removeAlert(index)}>
          <Svg id="trash" />
        </StyledIconButton>
      </StyledRow>
      <StyledDescription>
        <Trans
          i18nKey="alertDescription"
          components={[
            <SelectController
              name={`alerts.${index}.option`}
              control={control}
              options={options}
            />,
            <SelectController name={`alerts.${index}.item`} control={control} options={items} />,
          ]}
        />
      </StyledDescription>
      <InputController
        fullWidth
        name={`alerts.${index}.message`}
        control={control}
        label={t('alertMessage')}
        type="text"
        sx={{
          fieldset: { borderColor: variables.palette.outline_variant },
        }}
      />
    </StyledAlert>
  );
};
