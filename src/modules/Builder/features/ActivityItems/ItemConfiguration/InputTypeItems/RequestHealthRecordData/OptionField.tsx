import { useTranslation } from 'react-i18next';

import { RequestHealthRecordDataOption } from 'shared/state';
import { InputController } from 'shared/components/FormComponents';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledFlexAllCenter, StyledFlexTopCenter, StyledFlexTopStart } from 'shared/styles';
import { Svg } from 'shared/components';

import { SELECT_OPTION_TEXT_MAX_LENGTH } from '../../ItemConfiguration.const';

type OptionFieldProps = {
  name: string;
  index: number;
  option: RequestHealthRecordDataOption;
};

export const OptionField = ({ name, index, option }: OptionFieldProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'requestHealthRecordDataSettings' });
  const { control } = useCustomFormContext();

  const fieldName = `${name}.responseValues.optInOutOptions.${index}.label`;

  return (
    <StyledFlexTopStart sx={{ m: 2.4, gap: 1.2 }}>
      <StyledFlexTopCenter>
        <StyledFlexAllCenter sx={{ width: '4.8rem', height: '5.6rem' }}>
          <Svg id="radio-button-outline" />
        </StyledFlexAllCenter>
      </StyledFlexTopCenter>
      <InputController
        control={control}
        fullWidth
        withDebounce
        name={fieldName}
        label={t(`labels.${option.id}`)}
        placeholder={t(`placeholders.${option.id}`)}
        maxLength={SELECT_OPTION_TEXT_MAX_LENGTH}
        data-testid={`request-health-record-data-option-${option.id}`}
        InputLabelProps={{ shrink: true }}
      />
    </StyledFlexTopStart>
  );
};
