import { Tooltip } from 'shared/components/Tooltip';
import { StyledTitleTooltipIcon } from 'shared/styles';

import { StyledTitle, StyledUploadImg, StyledUploadImgs } from './Uploads.styles';
import { UploadsProps } from './Uploads.types';

export const Uploads = ({ uploads, wrapperStyles = {}, itemStyles = {} }: UploadsProps) => (
  <StyledUploadImgs sx={{ ...wrapperStyles }}>
    {uploads?.map(({ title, tooltipTitle, upload }) => (
      <StyledUploadImg key={title} sx={{ ...itemStyles }}>
        <StyledTitle>
          {title}
          <Tooltip tooltipTitle={tooltipTitle}>
            <span>
              <StyledTitleTooltipIcon id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledTitle>
        {upload}
      </StyledUploadImg>
    ))}
  </StyledUploadImgs>
);
