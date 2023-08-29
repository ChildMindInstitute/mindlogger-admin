import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  checkAppletNameInLibraryApi,
  publishAppletToLibraryApi,
  getAppletLibraryUrlApi,
} from 'api';
import { Spinner, SpinnerUiType } from 'shared/components';
import {
  InputController,
  CheckboxController,
  TagsController,
} from 'shared/components/FormComponents';
import { StyledErrorText, StyledBodyMedium } from 'shared/styles/styledComponents';
import { getErrorMessage } from 'shared/utils/errors';
import { useAsync } from 'shared/hooks';
import { getDictionaryText } from 'shared/utils';

import { ERROR_MARGIN_TOP, shareAppletDefaultValues } from './ShareApplet.const';
import { ShareAppletSchema } from './ShareApplet.schema';
import { ShareAppletData, ShareAppletProps } from './ShareApplet.types';
import { StyledInputWrapper } from './ShareApplet.styles';
import { SuccessShared } from './SuccessShared';

export const ShareApplet = ({
  applet,
  onAppletShared,
  onDisableSubmit,
  isSubmitted,
  setIsSubmitted,
  showSuccess = true,
}: ShareAppletProps) => {
  const { t } = useTranslation('app');

  const [appletShared, setAppletShared] = useState(false);
  const [showNameTakenError, setShowNameTakenError] = useState(false);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { execute: checkAppletNameInLibrary, error: nameError } = useAsync(
    checkAppletNameInLibraryApi,
  );
  const { execute: publishAppletToLibrary, error: publishError } =
    useAsync(publishAppletToLibraryApi);
  const { execute: getAppletLibraryUrl, error: libraryUrlError } = useAsync(getAppletLibraryUrlApi);

  const error = publishError || libraryUrlError;

  const { handleSubmit, control, watch, setValue } = useForm<ShareAppletData>({
    resolver: yupResolver(ShareAppletSchema()),
    defaultValues: { ...shareAppletDefaultValues, appletName: applet?.displayName },
  });

  const checked = watch('checked');
  const appletName = watch('appletName');
  const appletId = applet?.id || '';

  const handleShareApplet = async () => {
    if (applet) {
      try {
        await checkAppletNameInLibrary({ appletName });
        setIsLoading(true);
        await publishAppletToLibrary({
          appletId,
          appletName,
          keywords,
        });
        const libraryUrlResult = await getAppletLibraryUrl({
          appletId,
        });
        const libraryUrlReceived = libraryUrlResult?.data?.result?.url;
        setLibraryUrl(libraryUrlReceived);
        setIsLoading(false);
        onAppletShared?.({ keywords, libraryUrl: libraryUrlReceived });
        setAppletShared(true);
      } catch (error) {
        console.warn(error);
        setIsLoading(false);
      }
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (keyword.length) {
      setValue('keyword', '');
      setKeywords((prevState) => {
        if (prevState.some((item) => item === keyword)) {
          return prevState;
        }
        const newKeywords = prevState.concat(keyword);
        setValue('keywords', newKeywords);

        return newKeywords;
      });
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords((prevState) => {
      const newKeywords = prevState?.filter((_, i) => i !== index);
      setValue('keywords', newKeywords);

      return newKeywords;
    });
  };

  useEffect(() => {
    onDisableSubmit(!checked);
  }, [checked]);

  useEffect(() => {
    setShowNameTakenError(false);
    setIsSubmitted(false);
  }, [appletName]);

  useEffect(() => {
    setShowNameTakenError(!!nameError);
  }, [nameError]);

  useEffect(() => {
    if (isSubmitted && !appletShared) {
      handleSubmit(handleShareApplet)();
    }
  }, [isSubmitted, appletShared]);

  return appletShared && showSuccess && applet ? (
    <SuccessShared
      title={appletName || applet.displayName || ''}
      keywords={keywords}
      text={getDictionaryText(applet.description || '')}
      activitiesQuantity={applet.activityCount}
      appletLink={libraryUrl}
      img={applet.image || ''}
    />
  ) : (
    <>
      {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground={showSuccess} />}
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
            <StyledErrorText marginTop={ERROR_MARGIN_TOP}>
              <Trans i18nKey="appletNameAlreadyTaken">
                This Applet name is already taken in the Library. Please rename the Applet to share
                it. <br /> Note: This will change the name of the Applet for your users.
              </Trans>
            </StyledErrorText>
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
        {error && (
          <StyledInputWrapper>
            <StyledErrorText marginTop={0}>{getErrorMessage(error)}</StyledErrorText>
          </StyledInputWrapper>
        )}
      </form>
    </>
  );
};
