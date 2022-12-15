import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components/Popups';
import { InputController, CheckboxController, TagsController } from 'components/FormComponents';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';

import { ShareAppletProps, ShareAppletData } from './ShareApplet.types';
import { StyledInputWrapper } from './ShareApplet.styles';
import { shareAppletDefaultValues } from './ShareApplet.const';

export const ShareApplet = ({
  open,
  onClose,
  onSubmit,
  appletName,
  errorText,
}: ShareAppletProps) => {
  const { t } = useTranslation('app');
  const [showError, setShowError] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const { handleSubmit, control, watch, setValue, getValues } = useForm<ShareAppletData>({
    defaultValues: { ...shareAppletDefaultValues, appletName },
  });

  const checked = watch('checked');

  const handleAddKeyword = (value: string) => {
    if (value.length > 0) {
      setValue('keyword', '');
      setKeywords((prevState) => {
        if (prevState?.some((item) => item === value)) {
          return prevState;
        }
        const res = prevState?.concat(value);
        setValue('keywords', res);

        return res;
      });
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords((prevState) => {
      const res = prevState?.filter((_, i) => i !== index);
      setValue('keywords', res);

      return res;
    });
  };

  useEffect(() => {
    // console.log('keywords', keywords);
    console.log('get values', getValues());
  }, [keywords]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title={t('shareTheAppletWithTheLibrary')}
      buttonText={t('share')}
      disabledSubmit={!checked}
      width="60"
    >
      <>
        <StyledInputWrapper>
          <InputController
            fullWidth
            name="appletName"
            control={control}
            label={`${t('appletName')}*`}
            value={appletName}
          />
          {/*<StyledErrorText*/}
          {/*  marginTop={0.5}*/}
          {/*  dangerouslySetInnerHTML={{ __html: t('appletNameAlreadyTaken') }}*/}
          {/*/>*/}
        </StyledInputWrapper>
        <StyledInputWrapper>
          <TagsController
            fullWidth
            name="keyword"
            control={control}
            label={t('keywords')}
            tags={keywords}
            onAddTagClick={handleAddKeyword}
            onRemoveTagClick={handleRemoveKeyword}
          />
        </StyledInputWrapper>
        <StyledInputWrapper>
          <CheckboxController
            name="checked"
            control={control}
            label={<StyledBodyMedium>{t('agreementAppletAvailability') || ''}</StyledBodyMedium>}
          />
        </StyledInputWrapper>
      </>
    </Modal>
  );
};
