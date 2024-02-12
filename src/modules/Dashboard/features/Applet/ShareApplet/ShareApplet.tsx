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
import { useAsync } from 'shared/hooks/useAsync';
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
  'data-testid': dataTestid,
}: ShareAppletProps) => {
  const { t } = useTranslation('app');

  const [appletShared, setAppletShared] = useState(false);
  const [showNameTakenError, setShowNameTakenError] = useState(false);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppletNameDisabled, setIsAppletNameDisabled] = useState(false);

  const { execute: checkAppletNameInLibrary, error: nameError } = useAsync(
    checkAppletNameInLibraryApi,
  );
  const { execute: publishAppletToLibrary, error: publishError } =
    useAsync(publishAppletToLibraryApi);
  const { execute: getAppletLibraryUrl, error: libraryUrlError } = useAsync(getAppletLibraryUrlApi);

  const error = publishError || libraryUrlError;

  const { handleSubmit, control, watch, setValue } = useForm<ShareAppletData>({
    resolver: yupResolver(ShareAppletSchema()),
    defaultValues: shareAppletDefaultValues,
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
        onAppletShared?.({ keywords, libraryUrl: libraryUrlReceived, appletName });
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
        const newKeywords = prevState.concat(keyword.trim());
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

  useEffect(() => {
    if (!applet) return;
    setValue('appletName', applet.displayName);
  }, [applet]);

  useEffect(() => {
    (async () => {
      if (applet) {
        setIsLoading(true);
        try {
          await checkAppletNameInLibrary({ appletName: applet.displayName });
          setIsAppletNameDisabled(true);
        } catch (error) {
          setIsAppletNameDisabled(false);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  return appletShared && showSuccess && applet ? (
    <SuccessShared
      title={appletName || applet.displayName || ''}
      keywords={keywords}
      text={getDictionaryText(applet.description || '')}
      activitiesQuantity={applet.activityCount}
      appletLink={libraryUrl}
      img={applet.image || ''}
      data-testid={`${dataTestid}-shared`}
    />
  ) : (
    <>
      {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground={showSuccess} />}
      <form data-testid={`${dataTestid}-form`}>
        <StyledInputWrapper>
          <InputController
            fullWidth
            disabled={isAppletNameDisabled}
            name="appletName"
            error={showNameTakenError}
            control={control}
            label={t('appletName')}
            required
            data-testid={`${dataTestid}-applet-name`}
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
            data-testid={`${dataTestid}-keywords`}
          />
        </StyledInputWrapper>
        <StyledInputWrapper>
          <CheckboxController
            name="checked"
            control={control}
            label={<StyledBodyMedium>{t('agreementAppletAvailability') || ''}</StyledBodyMedium>}
            data-testid={`${dataTestid}-agreement`}
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
