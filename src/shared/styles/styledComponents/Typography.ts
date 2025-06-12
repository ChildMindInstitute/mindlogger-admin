import { css, styled, Typography } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export type FontWeight = keyof typeof variables.font.weight;
type LetterSpacing = keyof typeof variables.font.letterSpacing;

type StyledProps = {
  withDecoration?: boolean;
  color?: string;
  fontWeight?: FontWeight;
  letterSpacing?: LetterSpacing;
};

// Display variants - Affix Light
export const StyledDisplayLarge = styled(Typography)`
  font-family: ${variables.font.family.display};
  font-size: ${variables.font.size.display1};
  line-height: ${variables.font.lineHeight.display1};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${variables.font.weight.light};
  color: ${variables.palette.primary};
`;

export const StyledDisplayMedium = styled(Typography)`
  font-family: ${variables.font.family.display};
  font-size: ${variables.font.size.display2};
  line-height: ${variables.font.lineHeight.display2};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${variables.font.weight.light};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const StyledDisplaySmall = styled(Typography)`
  font-family: ${variables.font.family.display};
  font-size: ${variables.font.size.display3};
  line-height: ${variables.font.lineHeight.display3};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${variables.font.weight.light};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

// Headline variants - Moderat Regular
export const StyledHeadlineLarge = styled(Typography)`
  font-family: ${variables.font.family.headline};
  font-size: ${variables.font.size.headline1};
  line-height: ${variables.font.lineHeight.headline1};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${({ fontWeight }: StyledProps) => variables.font.weight[fontWeight ?? 'regular']};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const StyledHeadlineMedium = styled(Typography)`
  font-family: ${variables.font.family.headline};
  font-size: ${variables.font.size.headline2};
  line-height: ${variables.font.lineHeight.headline2};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${({ fontWeight }: StyledProps) => variables.font.weight[fontWeight ?? 'regular']};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const StyledHeadlineSmall = styled(Typography)`
  font-family: ${variables.font.family.headline};
  font-size: ${variables.font.size.headline3};
  line-height: ${variables.font.lineHeight.headline3};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${({ fontWeight }: StyledProps) => variables.font.weight[fontWeight ?? 'regular']};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledStickyHeadline = styled(StyledHeadlineLarge, shouldForwardProp)`
  transition: ${variables.transitions.fontSize};
  font-size: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.font.size.title2 : variables.font.size.headline2};
`;

// Title variants - Moderat Regular & Bold
export const StyledTitleLarge = styled(Typography)`
  font-family: ${variables.font.family.title};
  font-size: ${variables.font.size.title1};
  line-height: ${variables.font.lineHeight.title1};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleLargish = styled(Typography)`
  font-family: ${variables.font.family.title};
  font-size: ${variables.font.size.title2};
  line-height: ${variables.font.lineHeight.title2};
  letter-spacing: ${variables.font.letterSpacing.none};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleMedium = styled(Typography, shouldForwardProp)`
  font-family: ${variables.font.family.title};
  font-size: ${variables.font.size.title3};
  line-height: ${variables.font.lineHeight.title3};
  letter-spacing: ${variables.font.letterSpacing.md};
  font-weight: ${({ fontWeight }: StyledProps) => variables.font.weight[fontWeight ?? 'regular']};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleSmall = styled(Typography)`
  font-family: ${variables.font.family.title};
  font-size: ${variables.font.size.title4};
  line-height: ${variables.font.lineHeight.title4};
  letter-spacing: ${variables.font.letterSpacing.sm};
  font-weight: ${({ fontWeight }: StyledProps) => variables.font.weight[fontWeight ?? 'regular']};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface_variant};
`;

export const StyledTitleBoldLarge = styled(StyledTitleLarge)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldLargish = styled(StyledTitleLargish)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldMedium = styled(StyledTitleMedium)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldSmall = styled(StyledTitleSmall)`
  font-weight: ${variables.font.weight.bold};
`;

// Label variants - Moderat Regular & Bold
export const StyledLabelLarge = styled(Typography)`
  font-family: ${variables.font.family.label};
  font-size: ${variables.font.size.label1};
  line-height: ${variables.font.lineHeight.label1};
  letter-spacing: ${variables.font.letterSpacing.sm};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface_variant};
`;

export const StyledLabelMedium = styled(Typography, shouldForwardProp)`
  font-family: ${variables.font.family.label};
  font-size: ${variables.font.size.label2};
  line-height: ${variables.font.lineHeight.label2};
  letter-spacing: ${variables.font.letterSpacing.xxl};
  font-weight: ${({ fontWeight }: StyledProps) => variables.font.weight[fontWeight ?? 'regular']};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  text-decoration: ${({ withDecoration }: StyledProps) => (withDecoration ? 'underline' : 'none')};
`;

export const StyledLabelSmall = styled(Typography)`
  font-family: ${variables.font.family.label};
  font-size: ${variables.font.size.label3};
  line-height: ${variables.font.lineHeight.label3};
  letter-spacing: ${variables.font.letterSpacing.xxl};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledLabelBoldLarge = styled(StyledLabelLarge)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledLabelBoldMedium = styled(StyledLabelMedium)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledLabelBoldSmall = styled(StyledLabelSmall)`
  font-weight: ${variables.font.weight.bold};
`;

// Body variants - Moderat Regular
export const StyledBodyLarger = styled(Typography)`
  font-family: ${variables.font.family.body};
  font-size: ${variables.font.size.body1};
  line-height: ${variables.font.lineHeight.body1};
  letter-spacing: ${variables.font.letterSpacing.md};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledBodyLarge = styled(Typography)`
  font-family: ${variables.font.family.body};
  font-size: ${variables.font.size.body2};
  line-height: ${variables.font.lineHeight.body2};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface_variant};
  letter-spacing: ${({ letterSpacing }: StyledProps) =>
    variables.font.letterSpacing[letterSpacing ?? 'md']};
`;

export const StyledBodyMedium = styled(Typography)`
  font-family: ${variables.font.family.body};
  font-size: ${variables.font.size.body3};
  line-height: ${variables.font.lineHeight.body3};
  letter-spacing: ${variables.font.letterSpacing.lg};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const StyledBodySmall = styled(Typography)`
  font-family: ${variables.font.family.body};
  font-size: ${variables.font.size.body4};
  line-height: ${variables.font.lineHeight.body4};
  letter-spacing: ${variables.font.letterSpacing.xl};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const ellipsisTextCss = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const StyledEllipsisText = styled(Typography)(ellipsisTextCss);
