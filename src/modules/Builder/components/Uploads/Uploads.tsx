import { Tooltip } from 'shared/components';

import { StyledSvg, StyledTitle, StyledUploadImg, StyledUploadImgs } from './Uploads.styles';
import { UploadsProps } from './Uploads.types';

export const Uploads = ({ uploads, wrapperStyles = {}, itemStyles = {} }: UploadsProps) => (
  <StyledUploadImgs sx={{ ...wrapperStyles }}>
    {uploads?.map(({ title, tooltipTitle, upload }) => (
      <StyledUploadImg key={title} sx={{ ...itemStyles }}>
        <StyledTitle>
          {title}
          <Tooltip tooltipTitle={tooltipTitle}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledTitle>
        {upload}
      </StyledUploadImg>
    ))}
  </StyledUploadImgs>
);
