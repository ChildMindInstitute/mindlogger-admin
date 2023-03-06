import { Tooltip } from 'components';

import { StyledSvg, StyledTitle, StyledUploadImg, StyledUploadImgs } from './Uploads.styles';
import { UploadsProps } from './Uploads.types';

export const Uploads = ({ uploads }: UploadsProps) => (
  <StyledUploadImgs>
    {uploads?.map(({ title, tooltipTitle, upload }) => (
      <StyledUploadImg key={title}>
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
