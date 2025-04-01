import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { RequestHealthRecordDataOption } from 'shared/state';

import { OptionField } from './OptionField';
import { StyledContainer } from './RequestHealthRecordData.styles';
import { RequestHealthRecordDataProps } from './RequestHealthRecordData.types';

export const RequestHealthRecordData = ({ name }: RequestHealthRecordDataProps) => {
  const { t } = useTranslation('app');

  const optInOutOptions: RequestHealthRecordDataOption[] = useWatch({
    name: `${name}.responseValues.optInOutOptions`,
  });

  return (
    <StyledContainer>
      <StyledTitleMedium>{t('requestHealthRecordDataSettings.introText')}</StyledTitleMedium>

      {optInOutOptions?.map((option, index: number) => (
        <OptionField key={option.id} name={name} index={index} option={option} />
      ))}
    </StyledContainer>
  );
};
