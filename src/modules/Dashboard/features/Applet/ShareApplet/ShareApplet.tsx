import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  checkAppletNameInLibraryApi,
  publishAppletToLibraryApi,
  getAppletLibraryUrlApi,
} from 'api';
import { Spinner } from 'shared/components';
import {
  InputController,
  CheckboxController,
  TagsController,
} from 'shared/components/FormComponents';
import { StyledErrorText, StyledBodyMedium } from 'shared/styles/styledComponents';
import { getErrorMessage } from 'shared/utils/errors';

import { shareAppletDefaultValues } from './ShareApplet.const';
import { ShareAppletSchema } from './ShareApplet.schema';
import { ShareAppletData, ShareAppletProps } from './ShareApplet.types';
import { StyledInputWrapper } from './ShareApplet.styles';
import { SuccessShared } from './SuccessShared';

export const ShareApplet = ({
  applet,
  onAppletShared,
  onDisableSubmit,
  isSubmitted,
  showSuccess = true,
}: ShareAppletProps) => {
  const { t } = useTranslation('app');

  const [appletShared, setAppletShared] = useState(false);
  const [showNameTakenError, setShowNameTakenError] = useState(false);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, control, watch, setValue, getValues } = useForm<ShareAppletData>({
    resolver: yupResolver(ShareAppletSchema()),
    defaultValues: { ...shareAppletDefaultValues, appletName: applet?.displayName },
  });

  const checked = watch('checked');

  useEffect(() => {
    onDisableSubmit(!checked);
  }, [checked]);

  const handleShareApplet = async () => {
    if (applet) {
      try {
        const appletName = getValues().appletName || '';
        const checkResult = await checkAppletNameInLibraryApi({ appletName });
        setShowNameTakenError(checkResult?.data);
        if (checkResult?.data) return;

        setIsLoading(true);
        const publishResult = await publishAppletToLibraryApi({
          appletId: applet.id || '',
          appletName,
          keywords,
        });
        const appletId = publishResult?.data?.result?.id;
        const libraryUrlResult = await getAppletLibraryUrlApi({
          appletId,
        });
        setLibraryUrl(libraryUrlResult?.data?.result?.url as string);
        setIsLoading(false);
        onAppletShared?.({ keywords, libraryUrl: libraryUrlResult?.data?.result });
        setAppletShared(true);
      } catch (e) {
        setErrorMessage(getErrorMessage(e));
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isSubmitted && !appletShared) {
      handleSubmit(handleShareApplet)();
    }
  }, [isSubmitted, appletShared]);

  const handleAddKeyword = (value: string) => {
    if (value.length) {
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

  let modalComponent: JSX.Element | null = (
    <>
      {isLoading && <Spinner />}
      <form>
        <StyledInputWrapper>
          <InputController
            fullWidth
            name="appletName"
            error={showNameTakenError}
            control={control}
            label={t('appletName')}
            required
            value={applet?.displayName}
          />
          {showNameTakenError && (
            <StyledErrorText
              marginTop={0.5}
              dangerouslySetInnerHTML={{ __html: t('appletNameAlreadyTaken') }}
            />
          )}
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
        {errorMessage && (
          <StyledInputWrapper>
            <StyledErrorText marginTop={0}>{errorMessage}</StyledErrorText>
          </StyledInputWrapper>
        )}
      </form>
    </>
  );

  if (appletShared && showSuccess && applet) {
    modalComponent = (
      <SuccessShared
        title={getValues().appletName || applet.displayName || ''}
        text={applet?.description as string}
        keywords={keywords}
        // TODO: Implement applet activities quantity
        // activitiesQuantity={8}
        appletLink={libraryUrl}
        img={applet.image || ''}
      />
    );
  }

  return modalComponent;
};
