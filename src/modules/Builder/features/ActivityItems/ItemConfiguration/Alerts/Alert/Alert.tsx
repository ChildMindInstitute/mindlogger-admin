import { useTranslation, Trans } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { InputController, SelectController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, StyledTitleBoldSmall } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { items, options } from './Alert.const';
import { StyledAlert, StyledRow, StyledRemoveBtn, StyledDescription } from './Alert.styles';
import { ItemConfigurationForm } from '../../ItemConfiguration.types';

export const Alert = ({ index, removeAlert }: any) => {
  const { t } = useTranslation('app');
  const { control } = useFormContext<ItemConfigurationForm>();

  return (
    <StyledAlert>
      <StyledRow>
        <StyledTitleBoldSmall>Alert {index + 1}</StyledTitleBoldSmall>
        <StyledRemoveBtn onClick={() => removeAlert(index)}>
          <Svg id="trash" />
        </StyledRemoveBtn>
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
        label="Alert Message"
        type="text"
      />
    </StyledAlert>
  );
};
