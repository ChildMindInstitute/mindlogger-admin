import { styled } from '@mui/system';
import { Typography } from '@mui/material';

import { variables } from 'styles/variables';

type FontWeight = keyof typeof variables.font.weight;
type LetterSpacing = keyof typeof variables.letterSpacing;

type StyledProps = {
  withDecoration?: boolean;
  color?: string;
  fontWeight?: FontWeight;
  letterSpacing?: LetterSpacing;
};

export const StyledLargeTitle = styled(Typography)`
  font-size: ${variables.font.size.xl};
  line-height: ${variables.lineHeight.xl};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.medium};
  letter-spacing: ${variables.letterSpacing.sm};
  color: ${({ color }: StyledProps) => color || variables.palette.shades100};
`;

export const StyledBody = styled(Typography)`
  line-height: ${variables.lineHeight.lg};
  letter-spacing: ${variables.letterSpacing.md};
  color: ${({ color }: StyledProps) => color || variables.palette.shades100_alfa87};
`;

export const StyledMediumTitle = styled(Typography)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.lineHeight.md};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.medium};
  color: ${({ color }: StyledProps) => color || variables.palette.shades100};
  letter-spacing: ${({ letterSpacing }: StyledProps) =>
    letterSpacing ? variables.letterSpacing[letterSpacing] : variables.letterSpacing.sm};
`;

export const StyledSmallText = styled(Typography)`
  font-size: ${variables.font.size.sm};
  line-height: ${variables.lineHeight.sm};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.shades100};
  text-decoration: ${({ withDecoration }: StyledProps) => (withDecoration ? 'underline' : 'none')};
  letter-spacing: ${({ letterSpacing }: StyledProps) =>
    letterSpacing ? variables.letterSpacing[letterSpacing] : variables.letterSpacing.xl};
`;

export const StyledSmallTitle = styled(Typography)`
  font-size: ${variables.font.size.xs};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.lineHeight.xs};
  color: ${({ color }: StyledProps) => color || variables.palette.shades100};
  letter-spacing: ${variables.letterSpacing.xl};
`;
